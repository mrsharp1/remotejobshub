-- Test release_escrow RLS Bug Fix
BEGIN;

-- 1. Setup users
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000001001', 'buyer_checkout@example.com') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, email, full_name, role) VALUES ('00000000-0000-0000-0000-000000001001', 'buyer_checkout@example.com', 'Checkout Buyer', 'buyer') ON CONFLICT DO NOTHING;
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000001002', 'seller_checkout@example.com') ON CONFLICT DO NOTHING;
INSERT INTO public.profiles (id, email, full_name, role) VALUES ('00000000-0000-0000-0000-000000001002', 'seller_checkout@example.com', 'Checkout Seller', 'seller') ON CONFLICT DO NOTHING;

-- Reset wallets to known state for test
UPDATE public.wallets SET available_balance = 0, escrow_balance = 10000 WHERE user_id = '00000000-0000-0000-0000-000000001001';
UPDATE public.wallets SET available_balance = 0, escrow_balance = 0 WHERE user_id = '00000000-0000-0000-0000-000000001002';

-- Create an order and payment
INSERT INTO public.listings (id, seller_id, title, description, price, platform, country, status) 
VALUES ('00000000-0000-0000-0000-000000001100', '00000000-0000-0000-0000-000000001002', 'Checkout Listing', 'Testing', 10000, 'Upwork', 'Nigeria', 'published') ON CONFLICT (id) DO UPDATE SET status = 'published';

INSERT INTO public.orders (id, buyer_id, seller_id, listing_id, amount, status, currency)
VALUES ('00000000-0000-0000-0000-000000002000', '00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000001100', 10000, 'payment_received', 'NGN')
ON CONFLICT (id) DO UPDATE SET status = 'payment_received';

INSERT INTO public.payments (id, order_id, buyer_id, seller_id, paystack_reference, payment_status, amount, currency, platform_fee)
VALUES ('00000000-0000-0000-0000-000000003000', '00000000-0000-0000-0000-000000002000', '00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000001002', 'REF-TEST-001', 'success', 10000, 'NGN', 500)
ON CONFLICT (id) DO UPDATE SET payment_status = 'success';

-- Authenticate as the buyer
SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = '00000000-0000-0000-0000-000000001001';

-- Call the RPC
SELECT public.rpc_release_escrow('00000000-0000-0000-0000-000000003000') as result;

-- Reset to service role
RESET role;

-- Verify results
SELECT '--- SELLER WALLET ---' as section;
SELECT available_balance, escrow_balance FROM public.wallets WHERE user_id = '00000000-0000-0000-0000-000000001002';

SELECT '--- BUYER WALLET ---' as section;
SELECT available_balance, escrow_balance FROM public.wallets WHERE user_id = '00000000-0000-0000-0000-000000001001';

SELECT '--- PAYMENT STATUS ---' as section;
SELECT payment_status FROM public.payments WHERE id = '00000000-0000-0000-0000-000000003000';

SELECT '--- ORDER STATUS ---' as section;
SELECT status FROM public.orders WHERE id = '00000000-0000-0000-0000-000000002000';

ROLLBACK;
