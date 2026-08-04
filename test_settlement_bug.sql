-- Test markReleased RLS Bug
BEGIN;

-- 1. Setup users
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000001001', 'buyer_checkout@example.com') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, email, full_name, role) VALUES ('00000000-0000-0000-0000-000000001001', 'buyer_checkout@example.com', 'Checkout Buyer', 'buyer') ON CONFLICT DO NOTHING;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000001002', 'seller_checkout@example.com') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, email, full_name, role) VALUES ('00000000-0000-0000-0000-000000001002', 'seller_checkout@example.com', 'Checkout Seller', 'seller') ON CONFLICT DO NOTHING;

-- Create an order and payment
INSERT INTO public.listings (id, seller_id, title, description, price, platform, country, status) 
VALUES ('00000000-0000-0000-0000-000000001100', '00000000-0000-0000-0000-000000001002', 'Checkout Listing', 'Testing', 10000, 'Upwork', 'Nigeria', 'published') ON CONFLICT (id) DO UPDATE SET status = 'published';

INSERT INTO public.orders (id, buyer_id, seller_id, listing_id, amount, status, currency)
VALUES ('00000000-0000-0000-0000-000000002000', '00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000001100', 10000, 'payment_received', 'NGN')
ON CONFLICT (id) DO UPDATE SET status = 'payment_received';

INSERT INTO public.payments (id, order_id, buyer_id, seller_id, paystack_reference, payment_status, amount, currency, platform_fee)
VALUES ('00000000-0000-0000-0000-000000003000', '00000000-0000-0000-0000-000000002000', '00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000001002', 'REF-TEST-001', 'success', 10000, 'NGN', 500)
ON CONFLICT (id) DO NOTHING;

-- Now, simulate frontend calling supabase.from('payments').update({ payment_status: 'released' }).eq('id', id)
-- which is executed as the BUYER.

DO $$
DECLARE
  v_updated_rows int;
BEGIN
  -- Authenticate as the buyer
  SET LOCAL role authenticated;
  SET LOCAL request.jwt.claim.sub = '00000000-0000-0000-0000-000000001001';

  UPDATE public.payments
  SET payment_status = 'released',
      released_at = now()
  WHERE id = '00000000-0000-0000-0000-000000003000';

  GET DIAGNOSTICS v_updated_rows = ROW_COUNT;

  RAISE NOTICE 'ROWS UPDATED BY BUYER: %', v_updated_rows;

  -- The `.single()` in Supabase JS expects exactly 1 row to be returned.
  -- Since 0 rows are updated, it throws PGRST116.
END;
$$;

ROLLBACK;
