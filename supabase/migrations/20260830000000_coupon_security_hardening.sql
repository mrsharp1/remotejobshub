-- 1. Check for duplicates and negative counts before applying constraints
DO $$
DECLARE
  v_dup_count INT;
  v_neg_count INT;
BEGIN
  -- Check for duplicate redemptions
  SELECT COUNT(*) INTO v_dup_count FROM (
    SELECT coupon_id, user_id FROM public.coupon_redemptions 
    GROUP BY coupon_id, user_id HAVING COUNT(*) > 1
  ) AS duplicates;

  IF v_dup_count > 0 THEN
    RAISE EXCEPTION 'Cannot apply UNIQUE constraint: % duplicate redemptions found.', v_dup_count;
  END IF;

  -- Check for negative usage_count
  SELECT COUNT(*) INTO v_neg_count FROM public.coupons WHERE usage_count < 0;

  IF v_neg_count > 0 THEN
    RAISE EXCEPTION 'Cannot apply CHECK constraint: % coupons found with negative usage_count.', v_neg_count;
  END IF;
END $$;

-- 2. Drop the overly permissive UPDATE policy
DROP POLICY IF EXISTS "Authenticated users can update coupon usage" ON public.coupons;

-- 3. Add database constraints
ALTER TABLE public.coupon_redemptions ADD CONSTRAINT unique_coupon_redemption UNIQUE (coupon_id, user_id);
ALTER TABLE public.coupons ADD CONSTRAINT coupons_usage_count_check CHECK (usage_count >= 0);

-- 4. Re-define the RPC with hardened logic
CREATE OR REPLACE FUNCTION public.rpc_redeem_coupon_to_wallet(
  p_coupon_code text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_buyer_id uuid;
  v_coupon record;
  v_wallet_id uuid;
  v_new_balance numeric;
BEGIN
  v_buyer_id := auth.uid();
  IF v_buyer_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  -- Enforce buyer role using profiles
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_buyer_id AND role = 'buyer') THEN
    RETURN jsonb_build_object('success', false, 'message', 'Only buyers can redeem wallet credits.');
  END IF;

  -- 1. Validate coupon (lock for update to prevent race conditions)
  SELECT * INTO v_coupon FROM public.coupons 
  WHERE code = upper(p_coupon_code) AND is_active = true
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Invalid or inactive coupon code.');
  END IF;

  IF v_coupon.discount_type != 'fixed' THEN
    RETURN jsonb_build_object('success', false, 'message', 'This coupon is reserved for future order-level checkout and cannot be added as wallet credit.');
  END IF;

  IF now() > v_coupon.expires_at THEN
    RETURN jsonb_build_object('success', false, 'message', 'Coupon has expired.');
  END IF;

  IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count <= 0 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Coupon usage limit reached.');
  END IF;

  -- Verify user hasn't already redeemed it
  IF EXISTS (SELECT 1 FROM public.coupon_redemptions WHERE coupon_id = v_coupon.id AND user_id = v_buyer_id) THEN
    RETURN jsonb_build_object('success', false, 'message', 'You have already redeemed this coupon code.');
  END IF;

  -- 2. Ensure Wallet exists cleanly via ON CONFLICT to avoid unique constraint exceptions in race conditions
  INSERT INTO public.wallets (user_id) 
  VALUES (v_buyer_id) 
  ON CONFLICT (user_id) DO UPDATE SET updated_at = now()
  RETURNING id INTO v_wallet_id;

  -- 3. Decrement usage if limited
  IF v_coupon.usage_limit IS NOT NULL THEN
    UPDATE public.coupons SET usage_count = usage_count - 1, updated_at = now() WHERE id = v_coupon.id;
  END IF;

  -- 4. Create redemption record
  INSERT INTO public.coupon_redemptions (coupon_id, user_id, discount_amount)
  VALUES (v_coupon.id, v_buyer_id, v_coupon.discount_value);

  -- 5. Credit Wallet (Add to available_balance)
  UPDATE public.wallets 
  SET available_balance = available_balance + v_coupon.discount_value, updated_at = now() 
  WHERE id = v_wallet_id
  RETURNING available_balance INTO v_new_balance;

  -- 6. Create Wallet Transaction log
  INSERT INTO public.wallet_transactions (
    wallet_id, user_id, type, amount, status, description, metadata
  ) VALUES (
    v_wallet_id, v_buyer_id, 'bonus', v_coupon.discount_value, 'success', 
    'Promo Code: ' || v_coupon.code, 
    jsonb_build_object('coupon_id', v_coupon.id)
  );

  RETURN jsonb_build_object('success', true, 'message', 'Coupon redeemed successfully', 'balance', v_new_balance, 'discount_amount', v_coupon.discount_value);
EXCEPTION WHEN OTHERS THEN
  -- Do not leak SQLERRM directly to the client
  RETURN jsonb_build_object('success', false, 'message', 'An internal error occurred while processing this coupon.');
END;
$$;

-- 5. Harden Execution Privileges
REVOKE EXECUTE ON FUNCTION public.rpc_redeem_coupon_to_wallet(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rpc_redeem_coupon_to_wallet(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.rpc_redeem_coupon_to_wallet(text) TO authenticated;
