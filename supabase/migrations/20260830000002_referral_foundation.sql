-- Migration: 20260830000002_referral_foundation.sql
-- Description: Phase 1 database hardening for referral system.

-- 1. ADD REFERRAL CODE TO PROFILES
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- 2. GENERATE REFERRAL CODE TRIGGER
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_code TEXT;
    is_unique BOOLEAN;
BEGIN
    -- Only generate if it's currently null or empty
    IF NEW.referral_code IS NULL OR trim(NEW.referral_code) = '' THEN
        LOOP
            new_code := 'HUB-' || upper(substring(md5(random()::text) from 1 for 6));
            
            SELECT NOT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = new_code) INTO is_unique;
            
            IF is_unique THEN
                NEW.referral_code := new_code;
                EXIT;
            END IF;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ensure_referral_code_trigger ON public.profiles;
CREATE TRIGGER ensure_referral_code_trigger
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.generate_referral_code();

-- Backfill existing profiles seamlessly without changing updated_at too drastically if possible
UPDATE public.profiles SET referral_code = NULL WHERE referral_code IS NULL OR trim(referral_code) = '';

-- 3. UPGRADE REFERRAL SETTINGS
ALTER TABLE public.referral_settings ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.referral_settings ADD COLUMN IF NOT EXISTS minimum_purchase_amount NUMERIC NOT NULL DEFAULT 5000.0;

-- Ensure an initial row exists if empty
INSERT INTO public.referral_settings (reward_amount, minimum_purchase_amount, is_enabled)
SELECT 1000.0, 5000.0, true
WHERE NOT EXISTS (SELECT 1 FROM public.referral_settings);

-- 4. LOCK DOWN PUBLIC.REFERRALS
-- Prevent authenticated users from inserting their own referrals to spoof rewards
DROP POLICY IF EXISTS "Users can insert referrals (when signing up)" ON public.referrals;
DROP POLICY IF EXISTS "Users can update referrals" ON public.referrals;
DROP POLICY IF EXISTS "Users can view their referrals" ON public.referrals;

CREATE POLICY "Users can view their referrals" ON public.referrals
    FOR SELECT USING (
        auth.uid() = referrer_id OR 
        auth.uid() = referred_id OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 5. HARDEN REWARD PROCESSING
-- Drop the existing function so we can replace it with the new signature
DROP FUNCTION IF EXISTS public.rpc_process_referral_reward(uuid);

CREATE OR REPLACE FUNCTION public.rpc_process_referral_reward(p_buyer_id uuid, p_payment_amount numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_referral record;
    v_settings record;
    v_referrer_wallet record;
    v_tx_id uuid;
BEGIN
    -- Get settings
    SELECT * INTO v_settings FROM public.referral_settings LIMIT 1;
    
    IF v_settings IS NULL OR v_settings.is_enabled = false THEN
        RETURN;
    END IF;

    -- Verify minimum purchase threshold
    IF p_payment_amount < v_settings.minimum_purchase_amount THEN
        RETURN;
    END IF;

    -- Find pending referral for this buyer and LOCK it (Idempotency)
    SELECT * INTO v_referral FROM public.referrals 
    WHERE referred_id = p_buyer_id AND status = 'pending' 
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN; -- No pending referral (already paid or cancelled)
    END IF;

    -- Check for self-referral
    IF v_referral.referrer_id = v_referral.referred_id THEN
        RETURN;
    END IF;

    -- Lock referrer's wallet and credit them
    IF v_settings.reward_amount > 0 THEN
        SELECT * INTO v_referrer_wallet FROM public.wallets WHERE user_id = v_referral.referrer_id FOR UPDATE;

        IF v_referrer_wallet IS NOT NULL THEN
            UPDATE public.wallets
            SET available_balance = available_balance + v_settings.reward_amount,
                updated_at = now()
            WHERE id = v_referrer_wallet.id;

            INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, description)
            VALUES (
                v_referrer_wallet.id, 
                v_referral.referrer_id, 
                'referral_reward', 
                v_settings.reward_amount, 
                'success', 
                'Referral Reward - First purchase by referred user'
            )
            RETURNING id INTO v_tx_id;
        END IF;
    END IF;

    -- Update referral record
    UPDATE public.referrals
    SET status = 'paid',
        reward_amount = v_settings.reward_amount,
        first_purchase_date = now(),
        transaction_id = v_tx_id,
        updated_at = now()
    WHERE id = v_referral.id;
    
    -- Send Notification
    IF v_settings.reward_amount > 0 AND v_referrer_wallet IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, title, message, type, is_read)
        VALUES (
            v_referral.referrer_id, 
            'Referral Reward!', 
            'You earned ₦' || v_settings.reward_amount || ' for referring a new buyer who just made their first qualifying purchase!', 
            'payment', 
            false
        );
    END IF;
END;
$$;

-- 6. RE-CREATE RPC_RELEASE_ESCROW TO PASS PAYMENT AMOUNT
CREATE OR REPLACE FUNCTION public.rpc_release_escrow(p_payment_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_caller_id uuid;
    v_payment record;
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

    -- 7. Mark payment as released
    UPDATE public.payments 
    SET payment_status = 'released', platform_fee = v_platform_fee, released_at = now()
    WHERE id = p_payment_id;

    -- 8. Mark order as completed
    UPDATE public.orders SET status = 'completed' WHERE id = v_payment.order_id;

    -- 9. Insert timeline
    INSERT INTO public.order_timeline (order_id, status, notes)
    VALUES (v_payment.order_id, 'completed', 'Order escrow released. Payment finalized and transferred to seller.');

    -- 10. Insert Notifications
    -- Notify seller
    INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id, is_read)
    VALUES (
        v_payment.seller_id, 
        'Escrow Funds Released', 
        'Escrow payment of ₦' || v_payment.amount || ' has been released to your dashboard balance.', 
        'payment', 
        'order', 
        v_payment.order_id, 
        false
    );

    -- 11. Trigger Referral Reward for the Buyer (if any)
    -- Passes the actual payment amount to enforce minimum thresholds
    PERFORM public.rpc_process_referral_reward(v_payment.buyer_id, v_payment.amount);

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Escrow funds successfully released'
    );
END;
$$;
