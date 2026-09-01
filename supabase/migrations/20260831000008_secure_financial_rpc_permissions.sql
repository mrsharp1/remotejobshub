-- Migration: Secure Financial RPC Permissions

-- 1. Secure process_paystack_deposit
REVOKE EXECUTE ON FUNCTION public.process_paystack_deposit(UUID, NUMERIC, TEXT) FROM PUBLIC, anon, authenticated;
-- Only service_role needs this, which typically bypasses or is inherently granted, but we can be explicit
GRANT EXECUTE ON FUNCTION public.process_paystack_deposit(UUID, NUMERIC, TEXT) TO service_role;


-- 2. Secure rpc_mark_payment_refunded
CREATE OR REPLACE FUNCTION public.rpc_mark_payment_refunded(p_payment_id uuid)
RETURNS void AS $$
DECLARE
    v_caller_id uuid;
    v_payment record;
    v_buyer_wallet record;
BEGIN
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Require Admin internally
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_caller_id AND role = 'admin') THEN
        RAISE EXCEPTION 'Not authorized. Admin access required.';
    END IF;

    -- Fetch payment AND LOCK IT
    SELECT * INTO v_payment FROM public.payments WHERE id = p_payment_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment not found';
    END IF;

    -- Strict state checks
    IF v_payment.payment_status = 'refunded' THEN
        RAISE EXCEPTION 'Payment has already been refunded';
    END IF;

    IF v_payment.payment_status = 'released' THEN
        RAISE EXCEPTION 'Payment has already been released and cannot be refunded';
    END IF;

    IF v_payment.payment_status != 'success' THEN
        RAISE EXCEPTION 'Only successful, unreleased payments can be refunded';
    END IF;

    -- Lock buyer wallet
    SELECT * INTO v_buyer_wallet FROM public.wallets WHERE user_id = v_payment.buyer_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Buyer wallet not found';
    END IF;

    -- Check if escrow balance is sufficient (must be >= payment amount)
    IF v_buyer_wallet.escrow_balance < v_payment.amount THEN
        RAISE EXCEPTION 'Insufficient escrow balance to process refund';
    END IF;

    -- 1. Release escrow back to available balance
    UPDATE public.wallets 
    SET escrow_balance = escrow_balance - v_payment.amount,
        available_balance = available_balance + v_payment.amount,
        updated_at = now()
    WHERE id = v_buyer_wallet.id;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_buyer_wallet.id, v_payment.buyer_id, 'refund', v_payment.amount, 'success', v_payment.order_id::text, 'Escrow refunded to available balance');

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

REVOKE EXECUTE ON FUNCTION public.rpc_mark_payment_refunded(uuid) FROM PUBLIC, anon, authenticated;


-- 3. Secure rpc_mark_payment_released
REVOKE EXECUTE ON FUNCTION public.rpc_mark_payment_released(uuid) FROM PUBLIC, anon, authenticated;


-- 4. Secure rpc_process_referral_reward
-- Revoke the current function
REVOKE EXECUTE ON FUNCTION public.rpc_process_referral_reward(uuid, numeric) FROM PUBLIC, anon, authenticated;


-- 5. Fix rpc_release_escrow to allow Admin to release disputed orders
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
        -- Allow Admin to override dispute lock
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_caller_id AND role = 'admin') THEN
            RAISE EXCEPTION 'Cannot release escrow while order is under dispute';
        END IF;
    ELSIF v_order.status IN ('completed', 'cancelled') THEN
        RAISE EXCEPTION 'Order is already in a terminal state';
    END IF;

    -- 3. Fetch buyer wallet AND LOCK IT
    SELECT * INTO v_buyer_wallet FROM public.wallets WHERE user_id = v_payment.buyer_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Buyer wallet not found';
    END IF;

    IF v_buyer_wallet.escrow_balance < v_payment.amount THEN
        RAISE EXCEPTION 'Insufficient escrow balance';
    END IF;

    -- 4. Fetch seller wallet AND LOCK IT
    SELECT * INTO v_seller_wallet FROM public.wallets WHERE user_id = v_order.seller_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Seller wallet not found';
    END IF;

    -- Calculate fees
    v_platform_fee := ROUND(v_payment.amount * 0.05, 2);
    v_seller_payout := v_payment.amount - v_platform_fee;

    -- 5. Atomic fund transfer
    -- Release buyer's escrow
    UPDATE public.wallets 
    SET escrow_balance = escrow_balance - v_payment.amount,
        updated_at = now()
    WHERE id = v_buyer_wallet.id;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_buyer_wallet.id, v_payment.buyer_id, 'escrow_release', v_payment.amount, 'success', v_payment.order_id::text || '-RELEASE', 'Escrow released to seller');

    -- Credit seller
    UPDATE public.wallets 
    SET available_balance = available_balance + v_seller_payout,
        updated_at = now()
    WHERE id = v_seller_wallet.id;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_seller_wallet.id, v_order.seller_id, 'deposit', v_seller_payout, 'success', v_payment.order_id::text || '-PAYOUT', 'Earnings from completed order');

    -- 6. Update payment status
    UPDATE public.payments 
    SET payment_status = 'released', 
        platform_fee = v_platform_fee,
        released_at = now()
    WHERE id = v_payment.id;

    -- 7. Update order status
    UPDATE public.orders SET status = 'completed' WHERE id = v_order.id;

    -- 8. Insert timeline
    INSERT INTO public.order_timeline (order_id, status, notes)
    VALUES (v_order.id, 'completed', 'Order completed and funds released to seller.');

    -- 9. Trigger Referral Reward (if applicable)
    -- This handles its own idempotency and checks
    PERFORM public.rpc_process_referral_reward(v_payment.buyer_id, v_payment.amount);

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Escrow funds successfully released'
    );
END;
$$;


-- 6. Refactor rpc_admin_resolve_dispute to rely entirely on atomic RPCs without duplicating logic
CREATE OR REPLACE FUNCTION public.rpc_admin_resolve_dispute(
    p_dispute_id uuid,
    p_resolution text, -- 'buyer' or 'seller'
    p_notes text
)
RETURNS jsonb AS $$
DECLARE
    v_caller_id uuid;
    v_dispute record;
    v_order record;
    v_payment record;
BEGIN
    -- 1. Authentication and Authorization
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL OR NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_caller_id AND role = 'admin') THEN
        RAISE EXCEPTION 'Not authorized. Admin access required.';
    END IF;

    IF p_resolution NOT IN ('buyer', 'seller') THEN
        RAISE EXCEPTION 'Invalid resolution. Must be ''buyer'' or ''seller''.';
    END IF;

    -- 2. Lock Dispute
    SELECT * INTO v_dispute FROM public.disputes WHERE id = p_dispute_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Dispute not found';
    END IF;

    IF v_dispute.status != 'under_review' AND v_dispute.status != 'pending' THEN
        RAISE EXCEPTION 'Dispute is already resolved';
    END IF;

    -- 3. Lock Order
    SELECT * INTO v_order FROM public.orders WHERE id = v_dispute.order_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    IF v_order.status != 'disputed' THEN
        RAISE EXCEPTION 'Order is not in a disputed state';
    END IF;

    -- 4. Lock Payment
    SELECT * INTO v_payment FROM public.payments WHERE order_id = v_order.id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment not found';
    END IF;

    IF v_payment.payment_status != 'success' THEN
        RAISE EXCEPTION 'Payment is not in a resolvable state';
    END IF;

    -- Perform the core financial execution using the atomic RPCs
    IF p_resolution = 'seller' THEN
        -- Use the existing escrow release logic which atomically transfers funds, logs transactions, and triggers referrals
        -- (This works because rpc_release_escrow allows Admin to bypass the 'disputed' lock)
        PERFORM public.rpc_release_escrow(v_payment.id);

        -- Finalize dispute tracking
        UPDATE public.disputes SET status = 'resolved_seller', resolution_notes = p_notes, updated_at = now(), admin_id = v_caller_id WHERE id = p_dispute_id;
        
        -- Add admin resolution note to timeline
        INSERT INTO public.order_timeline (order_id, status, notes) VALUES (v_order.id, 'completed', 'Dispute resolved in favor of seller. Payout released. Notes: ' || p_notes);

    ELSE
        -- Use the existing refund logic
        PERFORM public.rpc_mark_payment_refunded(v_payment.id);

        -- Finalize dispute tracking
        UPDATE public.disputes SET status = 'resolved_buyer', resolution_notes = p_notes, updated_at = now(), admin_id = v_caller_id WHERE id = p_dispute_id;
        
        -- Add admin resolution note to timeline
        INSERT INTO public.order_timeline (order_id, status, notes) VALUES (v_order.id, 'cancelled', 'Dispute resolved in favor of buyer. Refund issued. Notes: ' || p_notes);
    END IF;

    RETURN jsonb_build_object('success', true, 'message', 'Dispute successfully resolved');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
