-- Create referral settings
CREATE TABLE IF NOT EXISTS public.referral_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reward_amount NUMERIC NOT NULL CHECK (reward_amount >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- Insert initial setting if table is empty
INSERT INTO public.referral_settings (reward_amount)
SELECT 1000.0 WHERE NOT EXISTS (SELECT 1 FROM public.referral_settings);

-- Only allow admins to update
ALTER TABLE public.referral_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage referral settings" ON public.referral_settings
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Anyone can view referral settings" ON public.referral_settings
    FOR SELECT USING (true);

-- Ensure referrals table has transaction_id if not already
ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS transaction_id UUID REFERENCES public.wallet_transactions(id);

-- Make an RPC for the referral reward process
CREATE OR REPLACE FUNCTION public.rpc_process_referral_reward(p_buyer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_referral record;
    v_reward_amount numeric;
    v_referrer_wallet record;
    v_tx_id uuid;
BEGIN
    -- 1. Find pending referral for this buyer
    SELECT * INTO v_referral FROM public.referrals 
    WHERE referred_id = p_buyer_id AND status = 'pending' 
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN; -- No pending referral, or already rewarded, exit silently
    END IF;

    -- 2. Get the current reward amount
    SELECT reward_amount INTO v_reward_amount FROM public.referral_settings LIMIT 1;
    IF v_reward_amount IS NULL THEN
        v_reward_amount := 1000.0;
    END IF;

    IF v_reward_amount > 0 THEN
        -- 3. Lock referrer's wallet
        SELECT * INTO v_referrer_wallet FROM public.wallets WHERE user_id = v_referral.referrer_id FOR UPDATE;

        IF v_referrer_wallet IS NOT NULL THEN
            -- 4. Credit referrer
            UPDATE public.wallets
            SET available_balance = available_balance + v_reward_amount,
                updated_at = now()
            WHERE id = v_referrer_wallet.id;

            -- 5. Create transaction
            INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, description)
            VALUES (v_referrer_wallet.id, v_referral.referrer_id, 'referral_reward', v_reward_amount, 'success', 'Referral Reward - First purchase by referred user')
            RETURNING id INTO v_tx_id;
        END IF;
    END IF;

    -- 6. Update referral record
    UPDATE public.referrals
    SET status = 'paid',
        reward_amount = v_reward_amount,
        first_purchase_date = now(),
        transaction_id = v_tx_id,
        updated_at = now()
    WHERE id = v_referral.id;
    
    -- 7. Notification
    IF v_reward_amount > 0 AND v_referrer_wallet IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, title, message, type, is_read)
        VALUES (
            v_referral.referrer_id, 
            'Referral Reward!', 
            'You earned ₦' || v_reward_amount || ' for referring a new buyer who just made their first purchase!', 
            'payment', 
            false
        );
    END IF;
END;
$$;

-- Hook into rpc_release_escrow to reward the referrer when the buyer completes their first purchase
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
    PERFORM public.rpc_process_referral_reward(v_payment.buyer_id);

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Escrow funds successfully released'
    );
END;
$$;
