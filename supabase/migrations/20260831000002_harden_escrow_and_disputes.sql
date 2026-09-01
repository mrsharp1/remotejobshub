-- Migration to harden escrow release and dispute creation

-- 1. Harden rpc_release_escrow
CREATE OR REPLACE FUNCTION public.rpc_release_escrow(p_payment_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_caller_id uuid;
    v_payment record;
    v_order record;
    v_buyer_wallet record;
    v_seller_wallet record;
    v_platform_fee numeric;
    v_seller_payout numeric;
BEGIN
    -- 1. Get authenticated user
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 2. Fetch payment AND LOCK IT
    SELECT * INTO v_payment FROM public.payments WHERE id = p_payment_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment not found';
    END IF;

    -- Only allow the buyer (who is approving the release) or an admin to execute this
    IF v_caller_id != v_payment.buyer_id AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_caller_id AND role = 'admin') THEN
        RAISE EXCEPTION 'Not authorized to release these funds';
    END IF;

    IF v_payment.payment_status = 'released' THEN
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Payment has already been released'
        );
    END IF;
    
    IF v_payment.payment_status != 'success' THEN
        RAISE EXCEPTION 'Only successful payments can be released';
    END IF;

    -- 2.5 Fetch order AND LOCK IT to prevent concurrent dispute creation
    SELECT * INTO v_order FROM public.orders WHERE id = v_payment.order_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    IF v_order.status = 'disputed' THEN
        RAISE EXCEPTION 'Cannot release escrow while order is under dispute';
    END IF;

    IF v_order.status IN ('completed', 'cancelled') THEN
        RAISE EXCEPTION 'Order is already in a terminal state';
    END IF;

    -- 3. Calculate fees
    v_platform_fee := ROUND(v_payment.amount * 0.05, 2);
    v_seller_payout := v_payment.amount - v_platform_fee;

    -- 4. Lock Wallets
    SELECT * INTO v_buyer_wallet FROM public.wallets WHERE user_id = v_payment.buyer_id FOR UPDATE;
    SELECT * INTO v_seller_wallet FROM public.wallets WHERE user_id = v_payment.seller_id FOR UPDATE;

    IF v_buyer_wallet IS NULL OR v_seller_wallet IS NULL THEN
        RAISE EXCEPTION 'Wallet not found for buyer or seller';
    END IF;

    IF v_buyer_wallet.escrow_balance < v_payment.amount THEN
        RAISE EXCEPTION 'Insufficient escrow balance';
    END IF;

    -- 5. Release buyer's escrow
    UPDATE public.wallets 
    SET escrow_balance = escrow_balance - v_payment.amount,
        updated_at = now()
    WHERE id = v_buyer_wallet.id;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_buyer_wallet.id, v_payment.buyer_id, 'escrow_release', v_payment.amount, 'success', v_payment.order_id::text || '-RELEASE', 'Escrow released for completed order');

    -- 6. Credit seller
    UPDATE public.wallets
    SET available_balance = available_balance + v_seller_payout, 
        updated_at = now()
    WHERE id = v_seller_wallet.id;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_seller_wallet.id, v_payment.seller_id, 'deposit', v_seller_payout, 'success', v_payment.order_id::text || '-PAYOUT', 'Earnings from completed order');

    -- 7. Update payment status
    UPDATE public.payments 
    SET payment_status = 'released', platform_fee = v_platform_fee, released_at = now()
    WHERE id = p_payment_id;

    -- 8. Mark order as completed
    UPDATE public.orders SET status = 'completed' WHERE id = v_payment.order_id;

    -- 9. Insert timeline
    INSERT INTO public.order_timeline (order_id, status, notes)
    VALUES (v_payment.order_id, 'completed', 'Order escrow released. Payment finalized and transferred to seller.');

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Escrow released successfully'
    );
END;
$$;

-- 2. Create rpc_create_dispute to ensure atomic creation and locking
CREATE OR REPLACE FUNCTION public.rpc_create_dispute(
    p_order_id uuid,
    p_reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_caller_id uuid;
    v_order record;
    v_dispute_id uuid;
BEGIN
    -- 1. Get authenticated user
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 2. Fetch order AND LOCK IT
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    -- Ensure caller is buyer or seller
    IF v_caller_id != v_order.buyer_id AND v_caller_id != v_order.seller_id THEN
        RAISE EXCEPTION 'Not authorized to open dispute on this order';
    END IF;

    -- 3. Check for terminal statuses and existing disputes
    IF v_order.status IN ('completed', 'cancelled', 'disputed') THEN
        RAISE EXCEPTION 'Cannot open dispute. Order is already in a terminal state or disputed.';
    END IF;

    -- Double check if dispute already exists
    IF EXISTS (SELECT 1 FROM public.disputes WHERE order_id = p_order_id) THEN
        RAISE EXCEPTION 'A dispute already exists for this order';
    END IF;

    -- 4. Create dispute
    INSERT INTO public.disputes (order_id, opened_by, reason, status)
    VALUES (p_order_id, v_caller_id, p_reason, 'pending')
    RETURNING id INTO v_dispute_id;

    -- 5. Update order status
    UPDATE public.orders SET status = 'disputed' WHERE id = p_order_id;

    -- 6. Log in timeline
    INSERT INTO public.order_timeline (order_id, status, notes)
    VALUES (p_order_id, 'disputed', 'Dispute opened. Reason: ' || p_reason);

    RETURN jsonb_build_object(
        'success', true,
        'dispute_id', v_dispute_id,
        'message', 'Dispute created successfully'
    );
END;
$$;
