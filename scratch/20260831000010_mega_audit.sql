DO $$
DECLARE
    v_buyer_id uuid := gen_random_uuid();
    v_seller_id uuid := gen_random_uuid();
    v_admin_id uuid;
    
    v_listing uuid := gen_random_uuid();
    v_order record; v_payment record;
    
    v_response jsonb;
BEGIN
    -- SETUP
    INSERT INTO auth.users (id, email) VALUES (v_buyer_id, 'buyer@test.com'), (v_seller_id, 'seller@test.com');
    INSERT INTO public.profiles (id, email, full_name, role) VALUES (v_buyer_id, 'buyer@test.com', 'Buyer', 'user'), (v_seller_id, 'seller@test.com', 'Seller', 'seller');
    
    SELECT id INTO v_admin_id FROM public.profiles WHERE role = 'admin' LIMIT 1;
    
    UPDATE public.wallets SET available_balance = 50000 WHERE user_id = v_buyer_id;
    
    INSERT INTO public.listings (id, seller_id, title, description, price, category, status)
    VALUES (v_listing, v_seller_id, 'L1', 'L1', 1000, 'Test', 'published');

    PERFORM set_config('role', 'authenticated', true);
    PERFORM set_config('request.jwt.claims', format('{"sub": "%s"}', v_buyer_id), true);
    
    PERFORM public.rpc_checkout_with_wallet(v_listing);
    SELECT * INTO v_order FROM public.orders WHERE listing_id = v_listing;
    SELECT * INTO v_payment FROM public.payments WHERE order_id = v_order.id;

    -- Test 1: Buyer attempting arbitrary refund (should fail due to missing admin role)
    BEGIN
        PERFORM public.rpc_mark_payment_refunded(v_payment.id);
        RAISE EXCEPTION 'Buyer arbitrary refund should be denied';
    EXCEPTION WHEN OTHERS THEN
        IF SQLERRM NOT LIKE '%permission denied%' AND SQLERRM NOT LIKE '%Admin access required%' THEN 
            RAISE EXCEPTION 'Unexpected error 1: %', SQLERRM; 
        END IF;
    END;

    -- Test 2: Seller attempting forced release (should fail due to caller != buyer)
    PERFORM set_config('request.jwt.claims', format('{"sub": "%s"}', v_seller_id), true);
    BEGIN
        PERFORM public.rpc_release_escrow(v_payment.id);
        RAISE EXCEPTION 'Seller force release should be denied';
    EXCEPTION WHEN OTHERS THEN
        IF SQLERRM NOT LIKE '%Not authorized to release these funds%' THEN RAISE EXCEPTION 'Unexpected error 2: %', SQLERRM; END IF;
    END;

    -- Test 3: Normal buyer release (success)
    PERFORM set_config('request.jwt.claims', format('{"sub": "%s"}', v_buyer_id), true);
    PERFORM public.rpc_release_escrow(v_payment.id);

    -- Test 4: Refund after release (admin role)
    PERFORM set_config('request.jwt.claims', format('{"sub": "%s"}', v_admin_id), true);
    -- We must run this as postgres or service_role because authenticated cannot execute rpc_mark_payment_refunded
    PERFORM set_config('role', 'postgres', true);
    BEGIN
        PERFORM public.rpc_mark_payment_refunded(v_payment.id);
        RAISE EXCEPTION 'Refund after release should be denied';
    EXCEPTION WHEN OTHERS THEN
        IF SQLERRM NOT LIKE '%cannot be refunded%' AND SQLERRM NOT LIKE '%Only successful%' THEN 
            RAISE EXCEPTION 'Unexpected error 4: %', SQLERRM; 
        END IF;
    END;
    
    -- Test 5: Duplicate release (buyer role)
    PERFORM set_config('role', 'authenticated', true);
    PERFORM set_config('request.jwt.claims', format('{"sub": "%s"}', v_buyer_id), true);
    v_response := public.rpc_release_escrow(v_payment.id);
    IF NOT (v_response->>'message' LIKE '%already been released%') THEN
        RAISE EXCEPTION 'Duplicate release should handle safely: %', v_response;
    END IF;

    -- Restore postgres role for cleanup
    PERFORM set_config('role', 'postgres', true);
    RAISE EXCEPTION 'ALL MEGA AUDIT TESTS PASSED_ROLLBACK';
END;
$$;
