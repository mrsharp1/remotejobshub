-- 20260802113500_financial_rpcs.sql

CREATE TABLE IF NOT EXISTS public.financial_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES auth.users(id),
    target_user_id UUID NOT NULL REFERENCES public.profiles(id),
    amount NUMERIC(12, 2) NOT NULL,
    transaction_type TEXT NOT NULL,
    reason TEXT NOT NULL,
    rpc_name TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on audit logs
ALTER TABLE public.financial_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit logs" ON public.financial_audit_logs FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 1. Purchase Promotion
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
    -- 1. Validation
    IF v_seller_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
    END IF;
    
    IF p_days <= 0 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Promotion days must be greater than 0');
    END IF;

    -- Idempotency check
    IF EXISTS (SELECT 1 FROM public.wallet_transactions WHERE payment_reference = p_idempotency_key) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Duplicate request');
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

    -- Ensure no duplicate active promotions
    IF EXISTS (SELECT 1 FROM public.promotions WHERE listing_id = p_listing_id AND active = true AND end_date > now()) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Listing already has an active promotion');
    END IF;

    -- Cost Calculation (1000 NGN per day)
    v_cost := p_days * 1000.00;

    -- 2. Lock Wallet
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_seller_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Wallet not found');
    END IF;

    IF v_wallet.available_balance < v_cost THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient wallet balance for this promotion');
    END IF;

    -- 3. Execute
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


-- 2. Request Withdrawal
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

    -- Validate rules
    IF p_amount < 1000 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Minimum withdrawal amount is ₦1,000');
    END IF;

    IF p_bank_name IS NULL OR p_account_number IS NULL OR p_account_name IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Complete bank details required');
    END IF;

    -- Idempotency / Duplicate Pending
    IF EXISTS (SELECT 1 FROM public.wallet_transactions WHERE payment_reference = p_idempotency_key) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Duplicate request');
    END IF;
    
    IF EXISTS (SELECT 1 FROM public.withdrawal_requests WHERE user_id = v_user_id AND status = 'pending') THEN
        RETURN jsonb_build_object('success', false, 'message', 'You already have a pending withdrawal request');
    END IF;

    -- Lock Wallet
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Wallet not found');
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

    -- Create Transaction (Using withdrawal_request ID as reference combined with idempotency key for safety)
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


-- 3. Process Withdrawal (Approve/Reject)
CREATE OR REPLACE FUNCTION public.rpc_process_withdrawal(
    p_request_id UUID,
    p_action TEXT,
    p_reason TEXT
)
RETURNS jsonb AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_is_admin BOOLEAN;
    v_request record;
    v_wallet record;
    v_transaction record;
BEGIN
    -- Auth
    SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') INTO v_is_admin;
    IF NOT v_is_admin THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Admin only');
    END IF;

    IF p_action NOT IN ('approve', 'reject') THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid action. Must be approve or reject.');
    END IF;

    -- Lock Request
    SELECT * INTO v_request FROM public.withdrawal_requests WHERE id = p_request_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Withdrawal request not found');
    END IF;

    IF v_request.status != 'pending' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Withdrawal request is already processed');
    END IF;

    -- Lock Wallet
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_request.user_id FOR UPDATE;
    
    IF p_action = 'approve' THEN
        -- Deduct from pending completely
        UPDATE public.wallets
        SET pending_balance = pending_balance - v_request.amount,
            updated_at = now()
        WHERE id = v_wallet.id
        RETURNING * INTO v_wallet;

        -- Update Request
        UPDATE public.withdrawal_requests SET status = 'approved', updated_at = now() WHERE id = p_request_id;
        
        -- Update Transaction (find the pending one)
        UPDATE public.wallet_transactions SET status = 'success' 
        WHERE user_id = v_request.user_id AND type = 'withdrawal' AND status = 'pending' AND ABS(amount) = v_request.amount
        RETURNING id INTO v_transaction;

        -- Audit Log
        INSERT INTO public.financial_audit_logs (actor_id, target_user_id, amount, transaction_type, reason, rpc_name)
        VALUES (v_admin_id, v_request.user_id, -v_request.amount, 'withdrawal_approved', 'Approved withdrawal', 'rpc_process_withdrawal');

        RETURN jsonb_build_object('success', true, 'message', 'Withdrawal approved', 'wallet_balance', v_wallet.available_balance, 'pending_balance', v_wallet.pending_balance);
        
    ELSIF p_action = 'reject' THEN
        IF p_reason IS NULL OR trim(p_reason) = '' THEN
            RETURN jsonb_build_object('success', false, 'message', 'Reason is required for rejection');
        END IF;

        -- Return to available
        UPDATE public.wallets
        SET pending_balance = pending_balance - v_request.amount,
            available_balance = available_balance + v_request.amount,
            updated_at = now()
        WHERE id = v_wallet.id
        RETURNING * INTO v_wallet;

        -- Update Request
        UPDATE public.withdrawal_requests SET status = 'rejected', updated_at = now() WHERE id = p_request_id;
        
        -- Update Transaction
        UPDATE public.wallet_transactions SET status = 'failed', description = description || ' (Rejected: ' || p_reason || ')'
        WHERE user_id = v_request.user_id AND type = 'withdrawal' AND status = 'pending' AND ABS(amount) = v_request.amount;

        -- Audit Log
        INSERT INTO public.financial_audit_logs (actor_id, target_user_id, amount, transaction_type, reason, rpc_name)
        VALUES (v_admin_id, v_request.user_id, v_request.amount, 'withdrawal_rejected', p_reason, 'rpc_process_withdrawal');

        RETURN jsonb_build_object('success', true, 'message', 'Withdrawal rejected and funds refunded', 'wallet_balance', v_wallet.available_balance, 'pending_balance', v_wallet.pending_balance);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Admin Adjust Wallet
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

    -- Idempotency
    IF EXISTS (SELECT 1 FROM public.wallet_transactions WHERE payment_reference = p_idempotency_key) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Duplicate request');
    END IF;

    -- Lock Wallet
    SELECT * INTO v_wallet FROM public.wallets WHERE id = p_wallet_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Wallet not found');
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


-- 5. Approve Referral Reward
CREATE OR REPLACE FUNCTION public.rpc_approve_referral_reward(
    p_reward_id UUID
)
RETURNS jsonb AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_is_admin BOOLEAN;
    v_reward record;
    v_wallet record;
    v_transaction_id UUID;
BEGIN
    SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') INTO v_is_admin;
    IF NOT v_is_admin THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Admin only');
    END IF;

    -- Lock Reward
    SELECT * INTO v_reward FROM public.referral_rewards WHERE id = p_reward_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Reward not found');
    END IF;

    IF v_reward.status != 'pending' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Reward is already processed');
    END IF;

    -- Lock Wallet (Using referrer_id derived from the referral relationship, or reward user_id)
    -- Wait, reward table has user_id or we need to join?
    -- In referral.service.ts, it selects `*, referral:referrals(*)`, and `referrerId = referral.referrer_id`.
    -- Let's just find the referrer_id from referrals table
    DECLARE
        v_referrer_id UUID;
        v_referral_id UUID;
    BEGIN
        SELECT referrer_id, id INTO v_referrer_id, v_referral_id FROM public.referrals WHERE id = v_reward.referral_id FOR UPDATE;
        IF NOT FOUND THEN
            RETURN jsonb_build_object('success', false, 'message', 'Associated referral not found');
        END IF;

        SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_referrer_id FOR UPDATE;
        IF NOT FOUND THEN
            RETURN jsonb_build_object('success', false, 'message', 'Referrer wallet not found');
        END IF;

        -- Update Wallet
        UPDATE public.wallets
        SET available_balance = available_balance + v_reward.amount,
            updated_at = now()
        WHERE id = v_wallet.id
        RETURNING * INTO v_wallet;

        -- Update Reward & Referral
        UPDATE public.referral_rewards SET status = 'approved', updated_at = now() WHERE id = p_reward_id;
        UPDATE public.referrals SET status = 'paid', updated_at = now() WHERE id = v_referral_id;

        -- Transaction
        INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
        VALUES (v_wallet.id, v_referrer_id, 'deposit', v_reward.amount, 'success', p_reward_id::text, 'Referral Affiliate Reward: Qualified Sign-up Conversion')
        RETURNING id INTO v_transaction_id;

        -- Audit
        INSERT INTO public.financial_audit_logs (actor_id, target_user_id, amount, transaction_type, reason, rpc_name)
        VALUES (v_admin_id, v_referrer_id, v_reward.amount, 'referral_reward', 'Approved referral reward', 'rpc_approve_referral_reward');

        RETURN jsonb_build_object(
            'success', true,
            'message', 'Referral reward approved',
            'transaction_id', v_transaction_id,
            'wallet_balance', v_wallet.available_balance
        );
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
