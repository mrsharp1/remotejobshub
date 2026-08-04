-- 20260727000005_payment_rpcs.sql
-- Create secure RPCs for payment processing and lock down payment tables

-- 0. Fix missing platform_fee column
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS platform_fee NUMERIC(12, 2);

-- 1. Lock down payments table RLS
DROP POLICY IF EXISTS "Enable update for users based on buyer_id" ON public.payments;
DROP POLICY IF EXISTS "Enable update for users based on seller_id" ON public.payments;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.payments;
DROP POLICY IF EXISTS "Only admins can update payments" ON public.payments;
DROP POLICY IF EXISTS "Buyers can insert pending payments" ON public.payments;

-- Only admins can update payments
CREATE POLICY "Only admins can update payments" ON public.payments
    FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Buyers can only insert pending or success payments
CREATE POLICY "Buyers can insert pending payments" ON public.payments
    FOR INSERT
    WITH CHECK (
        buyer_id = auth.uid() AND
        payment_status IN ('pending', 'success')
    );

-- 2. Create RPCs for payment mutations (SECURITY DEFINER)
-- Platform commission rate is 5%

CREATE OR REPLACE FUNCTION public.rpc_verify_payment(p_reference text, p_order_id uuid)
RETURNS void AS $$
DECLARE
    v_order record;
    v_buyer_wallet record;
BEGIN
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    -- Idempotency check for payment reference
    IF EXISTS (SELECT 1 FROM public.payments WHERE paystack_reference = p_reference) THEN
        RAISE EXCEPTION 'Payment reference already processed';
    END IF;

    -- Fetch buyer wallet for escrow transfer
    SELECT * INTO v_buyer_wallet FROM public.wallets WHERE user_id = v_order.buyer_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Buyer wallet not found';
    END IF;

    DECLARE
        v_buyer_fee numeric;
    BEGIN
        v_buyer_fee := ROUND(v_order.amount * 0.05);

        IF v_buyer_wallet.available_balance < (v_order.amount + v_buyer_fee) THEN
            RAISE EXCEPTION 'Insufficient wallet balance for escrow and fees';
        END IF;

        -- Move funds to escrow & deduct fee
        UPDATE public.wallets 
        SET available_balance = available_balance - (v_order.amount + v_buyer_fee),
            escrow_balance = escrow_balance + v_order.amount,
            updated_at = now()
        WHERE id = v_buyer_wallet.id;

        -- Insert escrow hold transaction
        INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
        VALUES (
            v_buyer_wallet.id, 
            v_order.buyer_id, 
            'escrow_hold', 
            -v_order.amount, 
            'success', 
            p_reference, 
            'Funds committed to escrow order'
        );

        -- Insert fee transaction
        INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
        VALUES (
            v_buyer_wallet.id, 
            v_order.buyer_id, 
            'purchase', 
            -v_buyer_fee, 
            'success', 
            p_reference || '-FEE', 
            'Buyer platform fee for order processing'
        );
    END;

    -- Update order status
    UPDATE public.orders SET status = 'payment_received' WHERE id = p_order_id;

    -- Insert payment record
    INSERT INTO public.payments (order_id, buyer_id, seller_id, paystack_reference, payment_status, amount, currency, paid_at)
    VALUES (p_order_id, v_order.buyer_id, v_order.seller_id, p_reference, 'success', v_order.amount, COALESCE(v_order.currency, 'NGN'), now());

    -- Insert timeline
    INSERT INTO public.order_timeline (order_id, status, notes)
    VALUES (p_order_id, 'payment_received', 'Paystack checkout completed successfully. Escrow funds secured.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION public.rpc_mark_payment_released(p_payment_id uuid)
RETURNS void AS $$
DECLARE
    v_payment record;
    v_order record;
    v_buyer_wallet record;
    v_seller_wallet record;
    v_platform_fee numeric;
    v_seller_payout numeric;
BEGIN
    -- Fetch payment
    SELECT * INTO v_payment FROM public.payments WHERE id = p_payment_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment not found';
    END IF;

    IF v_payment.payment_status = 'released' THEN
        RAISE EXCEPTION 'Payment has already been released';
    END IF;

    -- Calculate fees
    v_platform_fee := ROUND(v_payment.amount * 0.05);
    v_seller_payout := v_payment.amount - v_platform_fee;

    -- Wallet operations
    SELECT * INTO v_buyer_wallet FROM public.wallets WHERE user_id = v_payment.buyer_id FOR UPDATE;
    SELECT * INTO v_seller_wallet FROM public.wallets WHERE user_id = v_payment.seller_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for buyer or seller';
    END IF;

    -- 1. Release buyer's escrow
    UPDATE public.wallets 
    SET escrow_balance = escrow_balance - v_payment.amount,
        updated_at = now()
    WHERE id = v_buyer_wallet.id;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (
        v_buyer_wallet.id, 
        v_payment.buyer_id, 
        'escrow_release', 
        v_payment.amount, 
        'success', 
        v_payment.order_id::text, 
        'Escrow released for completed order'
    );

    -- 2. Credit seller
    UPDATE public.wallets
    SET available_balance = available_balance + v_seller_payout, 
        updated_at = now()
    WHERE id = v_seller_wallet.id;

    -- 'deposit' is valid for crediting seller, since 'earning' is not in the type enum
    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (
        v_seller_wallet.id, 
        v_payment.seller_id, 
        'deposit', 
        v_seller_payout, 
        'success', 
        v_payment.order_id::text, 
        'Earnings from completed order'
    );

    -- 3. Mark payment as released
    UPDATE public.payments 
    SET payment_status = 'released', platform_fee = v_platform_fee, released_at = now()
    WHERE id = p_payment_id;

    -- 4. Mark order as completed
    UPDATE public.orders SET status = 'completed' WHERE id = v_payment.order_id;

    -- 5. Insert timeline
    INSERT INTO public.order_timeline (order_id, status, notes)
    VALUES (v_payment.order_id, 'completed', 'Order escrow released. Payment finalized and transferred to seller.');

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION public.rpc_mark_payment_refunded(p_payment_id uuid)
RETURNS void AS $$
DECLARE
    v_payment record;
    v_buyer_wallet record;
BEGIN
    SELECT * INTO v_payment FROM public.payments WHERE id = p_payment_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment not found';
    END IF;

    IF v_payment.payment_status = 'refunded' THEN
        RAISE EXCEPTION 'Payment has already been refunded';
    END IF;

    SELECT * INTO v_buyer_wallet FROM public.wallets WHERE user_id = v_payment.buyer_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Buyer wallet not found';
    END IF;

    -- 1. Release escrow back to available balance
    UPDATE public.wallets 
    SET escrow_balance = escrow_balance - v_payment.amount,
        available_balance = available_balance + v_payment.amount,
        updated_at = now()
    WHERE id = v_buyer_wallet.id;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (
        v_buyer_wallet.id, 
        v_payment.buyer_id, 
        'refund', 
        v_payment.amount, 
        'success', 
        v_payment.order_id::text, 
        'Escrow refunded to available balance'
    );

    -- 2. Mark payment as refunded
    UPDATE public.payments 
    SET payment_status = 'refunded', refunded_at = now()
    WHERE id = p_payment_id;

    -- 3. Update order to cancelled
    UPDATE public.orders SET status = 'cancelled' WHERE id = v_payment.order_id;

    -- 4. Insert timeline
    INSERT INTO public.order_timeline (order_id, status, notes)
    VALUES (v_payment.order_id, 'cancelled', 'Order cancelled and funds returned to buyer wallet from escrow.');

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

