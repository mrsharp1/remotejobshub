-- Migration: 20260830000003_referral_attribution_rpc.sql
-- Description: Phase 1C backend attribution RPC

CREATE OR REPLACE FUNCTION public.rpc_register_user_with_referral(
    p_referred_id uuid,
    p_referral_code text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_referrer_id uuid;
    v_settings record;
BEGIN
    -- 1. Check if referral system is enabled
    SELECT * INTO v_settings FROM public.referral_settings LIMIT 1;
    IF v_settings IS NULL OR v_settings.is_enabled = false THEN
        RETURN;
    END IF;

    -- 2. Validate format of referral code
    IF p_referral_code IS NULL OR trim(p_referral_code) = '' THEN
        RETURN;
    END IF;
    
    p_referral_code := upper(trim(p_referral_code));

    -- 3. Resolve referrer_id
    SELECT id INTO v_referrer_id FROM public.profiles WHERE referral_code = p_referral_code;

    IF v_referrer_id IS NULL THEN
        RETURN; -- Invalid code
    END IF;

    -- 4. Verify the authenticated user is the referred user
    IF auth.uid() IS NULL OR auth.uid() != p_referred_id THEN
        RETURN; -- Not authorized
    END IF;

    -- 5. Reject self-referrals
    IF v_referrer_id = p_referred_id THEN
        RETURN;
    END IF;

    -- 6. Check for duplicate attribution
    IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_id = p_referred_id) THEN
        RETURN; -- Already has a referrer
    END IF;

    -- 7. Insert the referral
    INSERT INTO public.referrals (
        referrer_id,
        referred_id,
        referral_code,
        status,
        reward_amount
    ) VALUES (
        v_referrer_id,
        p_referred_id,
        p_referral_code,
        'pending',
        v_settings.reward_amount
    );
END;
$$;
