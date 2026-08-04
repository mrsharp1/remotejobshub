-- 20260802082354_fix_buyer_fee_leak.sql
-- Fixes a bug where rpc_verify_payment did not deduct the 5% buyer platform fee from the buyer's wallet,
-- allowing the buyer to keep the fee as available balance.

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
