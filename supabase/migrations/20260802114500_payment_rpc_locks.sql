-- 20260802114500_payment_rpc_locks.sql

-- 1. Fix rpc_verify_payment (Serialize idempotency check behind wallet lock)
CREATE OR REPLACE FUNCTION public.rpc_verify_payment(p_reference text, p_order_id uuid)
RETURNS void AS $$
DECLARE
    v_order record;
    v_buyer_wallet record;
    v_buyer_fee numeric;
BEGIN
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    -- Fetch buyer wallet for escrow transfer AND lock it to serialize concurrent requests
    SELECT * INTO v_buyer_wallet FROM public.wallets WHERE user_id = v_order.buyer_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Buyer wallet not found';
    END IF;

    -- Idempotency check for payment reference (Safe now due to row lock)
    IF EXISTS (SELECT 1 FROM public.payments WHERE paystack_reference = p_reference) THEN
        RAISE EXCEPTION 'Payment reference already processed';
    END IF;

    v_buyer_fee := ROUND(v_order.amount * 0.05, 2);

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
    VALUES (v_buyer_wallet.id, v_order.buyer_id, 'escrow_hold', -v_order.amount, 'success', p_reference, 'Funds committed to escrow order');

    -- Insert fee transaction
    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_buyer_wallet.id, v_order.buyer_id, 'purchase', -v_buyer_fee, 'success', p_reference || '-FEE', 'Buyer platform fee for order processing');

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


-- 2. Fix rpc_mark_payment_released (Lock payments row)
CREATE OR REPLACE FUNCTION public.rpc_mark_payment_released(p_payment_id uuid)
RETURNS void AS $$
DECLARE
    v_payment record;
    v_buyer_wallet record;
    v_seller_wallet record;
    v_platform_fee numeric;
    v_seller_payout numeric;
BEGIN
    -- Fetch payment AND LOCK IT
    SELECT * INTO v_payment FROM public.payments WHERE id = p_payment_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment not found';
    END IF;

    IF v_payment.payment_status = 'released' THEN
        RAISE EXCEPTION 'Payment has already been released';
    END IF;

    -- Calculate fees
    v_platform_fee := ROUND(v_payment.amount * 0.05, 2);
    v_seller_payout := v_payment.amount - v_platform_fee;

    -- Wallet operations
    SELECT * INTO v_buyer_wallet FROM public.wallets WHERE user_id = v_payment.buyer_id FOR UPDATE;
    SELECT * INTO v_seller_wallet FROM public.wallets WHERE user_id = v_payment.seller_id FOR UPDATE;

    IF v_buyer_wallet IS NULL OR v_seller_wallet IS NULL THEN
        RAISE EXCEPTION 'Wallet not found for buyer or seller';
    END IF;

    -- 1. Release buyer's escrow
    UPDATE public.wallets 
    SET escrow_balance = escrow_balance - v_payment.amount,
        updated_at = now()
    WHERE id = v_buyer_wallet.id;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_buyer_wallet.id, v_payment.buyer_id, 'escrow_release', v_payment.amount, 'success', v_payment.order_id::text, 'Escrow released for completed order');

    -- 2. Credit seller
    UPDATE public.wallets
    SET available_balance = available_balance + v_seller_payout, 
        updated_at = now()
    WHERE id = v_seller_wallet.id;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_seller_wallet.id, v_payment.seller_id, 'deposit', v_seller_payout, 'success', v_payment.order_id::text, 'Earnings from completed order');

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


-- 3. Fix rpc_mark_payment_refunded (Lock payments row)
CREATE OR REPLACE FUNCTION public.rpc_mark_payment_refunded(p_payment_id uuid)
RETURNS void AS $$
DECLARE
    v_payment record;
    v_buyer_wallet record;
BEGIN
    SELECT * INTO v_payment FROM public.payments WHERE id = p_payment_id FOR UPDATE;
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


-- 4. Fix rpc_request_withdrawal (Move idempotency behind lock)
CREATE OR REPLACE FUNCTION public.rpc_request_withdrawal(
    p_amount NUMERIC(12, 2),
    p_bank_name TEXT,
    p_account_number TEXT,
    p_account_name TEXT,
    p_idempotency_key TEXT
)
RETURNS jsonb AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_wallet record;
    v_request_id UUID;
    v_transaction_id UUID;
BEGIN
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
    END IF;

    IF p_amount < 1000 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Minimum withdrawal amount is ₦1,000');
    END IF;

    IF p_bank_name IS NULL OR p_account_number IS NULL OR p_account_name IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Complete bank details required');
    END IF;

    -- Lock Wallet to serialize requests
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Wallet not found');
    END IF;

    -- Idempotency / Duplicate Pending (Now safe from race conditions due to lock)
    IF EXISTS (SELECT 1 FROM public.wallet_transactions WHERE payment_reference = p_idempotency_key) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Duplicate request');
    END IF;
    
    IF EXISTS (SELECT 1 FROM public.withdrawal_requests WHERE user_id = v_user_id AND status = 'pending') THEN
        RETURN jsonb_build_object('success', false, 'message', 'You already have a pending withdrawal request');
    END IF;

    IF v_wallet.available_balance < p_amount THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient available balance');
    END IF;

    -- Move to Pending
    UPDATE public.wallets
    SET available_balance = available_balance - p_amount,
        pending_balance = COALESCE(pending_balance, 0) + p_amount,
        updated_at = now()
    WHERE id = v_wallet.id
    RETURNING * INTO v_wallet;

    -- Create Request
    INSERT INTO public.withdrawal_requests (user_id, amount, bank_name, account_number, account_name, status)
    VALUES (v_user_id, p_amount, p_bank_name, p_account_number, p_account_name, 'pending')
    RETURNING id INTO v_request_id;

    -- Create Transaction
    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_wallet.id, v_user_id, 'withdrawal', -p_amount, 'pending', p_idempotency_key, 'Withdrawal request submitted to ' || p_bank_name)
    RETURNING id INTO v_transaction_id;

    -- Audit Log
    INSERT INTO public.financial_audit_logs (actor_id, target_user_id, amount, transaction_type, reason, rpc_name)
    VALUES (v_user_id, v_user_id, -p_amount, 'withdrawal_request', 'Requested withdrawal to bank', 'rpc_request_withdrawal');

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Withdrawal request submitted successfully',
        'transaction_id', v_transaction_id,
        'request_id', v_request_id,
        'wallet_balance', v_wallet.available_balance,
        'pending_balance', v_wallet.pending_balance
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. Fix rpc_purchase_promotion (Move idempotency behind lock)
CREATE OR REPLACE FUNCTION public.rpc_purchase_promotion(
    p_listing_id UUID,
    p_days INT,
    p_idempotency_key TEXT
)
RETURNS jsonb AS $$
DECLARE
    v_seller_id UUID := auth.uid();
    v_listing record;
    v_wallet record;
    v_cost NUMERIC(12, 2);
    v_transaction_id UUID;
BEGIN
    -- Validation
    IF v_seller_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
    END IF;
    
    IF p_days <= 0 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Promotion days must be greater than 0');
    END IF;

    -- Verify Listing
    SELECT * INTO v_listing FROM public.listings WHERE id = p_listing_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Listing not found');
    END IF;
    
    IF v_listing.seller_id != v_seller_id THEN
        RETURN jsonb_build_object('success', false, 'message', 'You do not own this listing');
    END IF;
    
    IF v_listing.status != 'active' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Listing must be active to purchase promotion');
    END IF;

    -- Lock Wallet to serialize requests
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_seller_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Wallet not found');
    END IF;

    -- Idempotency check (Safe due to lock)
    IF EXISTS (SELECT 1 FROM public.wallet_transactions WHERE payment_reference = p_idempotency_key) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Duplicate request');
    END IF;

    -- Ensure no duplicate active promotions
    IF EXISTS (SELECT 1 FROM public.promotions WHERE listing_id = p_listing_id AND active = true AND end_date > now()) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Listing already has an active promotion');
    END IF;

    v_cost := p_days * 1000.00;

    IF v_wallet.available_balance < v_cost THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient wallet balance for this promotion');
    END IF;

    -- Execute
    UPDATE public.wallets 
    SET available_balance = available_balance - v_cost,
        updated_at = now()
    WHERE id = v_wallet.id
    RETURNING * INTO v_wallet;

    -- Insert Transaction
    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_wallet.id, v_seller_id, 'purchase', -v_cost, 'success', p_idempotency_key, 'Listing Boost Purchase for ' || p_days || ' Days')
    RETURNING id INTO v_transaction_id;

    -- Create Promotion
    INSERT INTO public.promotions (user_id, listing_id, title, description, discount_type, discount_value, campaign_type, start_date, end_date, active)
    VALUES (v_seller_id, p_listing_id, 'FEATURED BOOST', 'Premium listing visibility boost', 'percentage', 0, 'seller_boost', now(), now() + (p_days || ' days')::interval, true);

    -- Audit Log
    INSERT INTO public.financial_audit_logs (actor_id, target_user_id, amount, transaction_type, reason, rpc_name)
    VALUES (v_seller_id, v_seller_id, -v_cost, 'purchase', 'Purchased listing promotion', 'rpc_purchase_promotion');

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Promotion purchased successfully',
        'transaction_id', v_transaction_id,
        'wallet_balance', v_wallet.available_balance,
        'pending_balance', COALESCE(v_wallet.pending_balance, 0)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6. Fix rpc_admin_adjust_wallet (Move idempotency behind lock)
CREATE OR REPLACE FUNCTION public.rpc_admin_adjust_wallet(
    p_wallet_id UUID,
    p_amount NUMERIC(12, 2),
    p_type TEXT,
    p_reason TEXT,
    p_idempotency_key TEXT
)
RETURNS jsonb AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_is_admin BOOLEAN;
    v_wallet record;
    v_transaction_id UUID;
    v_signed_amount NUMERIC(12, 2);
    v_transaction_type TEXT;
BEGIN
    SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') INTO v_is_admin;
    IF NOT v_is_admin THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Admin only');
    END IF;

    IF p_amount <= 0 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Amount must be greater than 0');
    END IF;
    
    IF p_reason IS NULL OR trim(p_reason) = '' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Adjustment reason is required');
    END IF;

    IF p_type NOT IN ('credit', 'debit') THEN
        RETURN jsonb_build_object('success', false, 'message', 'Type must be credit or debit');
    END IF;

    -- Lock Wallet to serialize
    SELECT * INTO v_wallet FROM public.wallets WHERE id = p_wallet_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Wallet not found');
    END IF;

    -- Idempotency
    IF EXISTS (SELECT 1 FROM public.wallet_transactions WHERE payment_reference = p_idempotency_key) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Duplicate request');
    END IF;

    IF p_type = 'credit' THEN
        v_signed_amount := p_amount;
        v_transaction_type := 'deposit';
    ELSE
        IF v_wallet.available_balance < p_amount THEN
            RETURN jsonb_build_object('success', false, 'message', 'Insufficient available balance for debit adjustment');
        END IF;
        v_signed_amount := -p_amount;
        v_transaction_type := 'withdrawal';
    END IF;

    -- Apply Adjustment
    UPDATE public.wallets
    SET available_balance = available_balance + v_signed_amount,
        updated_at = now()
    WHERE id = v_wallet.id
    RETURNING * INTO v_wallet;

    -- Insert Transaction
    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_wallet.id, v_wallet.user_id, v_transaction_type, v_signed_amount, 'success', p_idempotency_key, 'Admin Adjustment: ' || p_reason)
    RETURNING id INTO v_transaction_id;

    -- Audit Log
    INSERT INTO public.financial_audit_logs (actor_id, target_user_id, amount, transaction_type, reason, rpc_name)
    VALUES (v_admin_id, v_wallet.user_id, v_signed_amount, 'admin_adjustment', p_reason, 'rpc_admin_adjust_wallet');

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Wallet adjusted successfully',
        'transaction_id', v_transaction_id,
        'wallet_balance', v_wallet.available_balance,
        'pending_balance', COALESCE(v_wallet.pending_balance, 0)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
