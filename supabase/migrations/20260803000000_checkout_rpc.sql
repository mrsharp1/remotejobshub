-- 20260803000000_checkout_rpc.sql
-- Create atomic checkout RPC

CREATE OR REPLACE FUNCTION public.rpc_checkout_with_wallet(p_listing_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_buyer_id uuid;
    v_listing record;
    v_buyer_wallet record;
    v_existing_order record;
    v_amount numeric;
    v_fee numeric;
    v_total numeric;
    v_order_id uuid;
    v_payment_id uuid;
    v_reference text;
BEGIN
    -- 1. Get authenticated buyer via auth.uid()
    v_buyer_id := auth.uid();
    IF v_buyer_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Idempotency check: detect existing active order for this exact buyer and listing
    SELECT * INTO v_existing_order FROM public.orders 
    WHERE buyer_id = v_buyer_id AND listing_id = p_listing_id AND status != 'cancelled';
    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', true,
            'order_id', v_existing_order.id,
            'message', 'Order already exists'
        );
    END IF;

    -- 2 & 3. Fetch and validate listing (lock it to prevent concurrent purchases)
    SELECT * INTO v_listing FROM public.listings WHERE id = p_listing_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Listing not found';
    END IF;

    IF v_listing.seller_id = v_buyer_id THEN
        RAISE EXCEPTION 'Cannot purchase your own listing';
    END IF;

    IF v_listing.status != 'published' THEN
        RAISE EXCEPTION 'Listing is no longer available for purchase';
    END IF;

    -- 4. Lock the buyer wallet using SELECT ... FOR UPDATE
    SELECT * INTO v_buyer_wallet FROM public.wallets WHERE user_id = v_buyer_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Buyer wallet not found';
    END IF;

    -- 6. Calculate final payable amount
    v_amount := v_listing.price;
    v_fee := ROUND(v_amount * 0.05);
    v_total := v_amount + v_fee;

    -- 5. Verify sufficient wallet balance
    IF v_buyer_wallet.available_balance < v_total THEN
        RAISE EXCEPTION 'Insufficient wallet balance. Please fund your wallet.';
    END IF;

    -- 7. Deduct buyer wallet balance & move to escrow
    UPDATE public.wallets
    SET available_balance = available_balance - v_total,
        escrow_balance = escrow_balance + v_amount,
        updated_at = now()
    WHERE id = v_buyer_wallet.id;

    -- 8 & 9. Create wallet ledger transactions (escrow hold & fee)
    v_reference := 'CHK-' || upper(substr(md5(random()::text), 1, 8)) || '-' || extract(epoch from now())::bigint;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_buyer_wallet.id, v_buyer_id, 'escrow_hold', -v_amount, 'success', v_reference, 'Funds committed to escrow order');

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_buyer_wallet.id, v_buyer_id, 'purchase', -v_fee, 'success', v_reference || '-FEE', 'Buyer platform fee for order processing');

    -- Mark listing as sold to prevent anyone else from buying it
    UPDATE public.listings SET status = 'sold' WHERE id = p_listing_id;

    -- 10. Create marketplace order
    INSERT INTO public.orders (buyer_id, seller_id, listing_id, amount, currency, status)
    VALUES (v_buyer_id, v_listing.seller_id, p_listing_id, v_amount, 'NGN', 'payment_received')
    RETURNING id INTO v_order_id;

    -- 11. Create payment record
    INSERT INTO public.payments (order_id, buyer_id, seller_id, paystack_reference, payment_status, amount, currency, platform_fee, paid_at)
    VALUES (v_order_id, v_buyer_id, v_listing.seller_id, v_reference, 'success', v_amount, 'NGN', v_fee, now())
    RETURNING id INTO v_payment_id;

    -- 12. Create order timeline
    INSERT INTO public.order_timeline (order_id, status, notes)
    VALUES (v_order_id, 'payment_received', 'Wallet checkout completed successfully. Escrow funds secured.');

    -- 13. Create buyer notification
    INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id, is_read)
    VALUES (
        v_buyer_id, 
        'Escrow Payment Confirmed 💳', 
        'Your payment of ₦' || v_amount || ' for order #' || substr(v_order_id::text, 1, 8) || ' was successfully verified and secured in escrow.', 
        'payment', 
        'order', 
        v_order_id, 
        false
    );

    -- 14. Create seller notification
    INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id, is_read)
    VALUES (
        v_listing.seller_id, 
        'Payment Secured in Escrow 💳', 
        'Buyer has paid ₦' || v_amount || ' for your listing. Funds are secured in escrow. Please deliver credentials.', 
        'payment', 
        'order', 
        v_order_id, 
        false
    );

    -- 15 & 16. Commit transaction & Return success response
    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'payment_id', v_payment_id,
        'escrow_id', v_reference,
        'wallet_balance', v_buyer_wallet.available_balance - v_total,
        'message', 'Checkout completed successfully'
    );
END;
$$;
