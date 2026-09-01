-- Phase 2 Financial Remediation for cf7db003-e8b4-45d5-8604-d53e33530a63

DO $$
DECLARE
    v_order_id uuid := 'cf7db003-e8b4-45d5-8604-d53e33530a63';
    v_payment record;
    v_order record;
    v_buyer_wallet record;
    v_seller_wallet record;
BEGIN
    -- 1. Lock and fetch payment
    SELECT * INTO v_payment FROM public.payments WHERE order_id = v_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- 2. Lock and fetch order
    SELECT * INTO v_order FROM public.orders WHERE id = v_order_id FOR UPDATE;
    
    -- 3. Lock buyer wallet
    SELECT * INTO v_buyer_wallet FROM public.wallets WHERE user_id = v_order.buyer_id FOR UPDATE;
    
    -- 4. Correct the historically corrupted escrow balance (missing hold for 9911df5c) before processing refund
    -- A past test script released 30 without a corresponding hold, leaving escrow_balance artificially short by 30.
    -- We temporarily restore the 30 so the 50 refund doesn't violate the >= 0 check constraint.
    UPDATE public.wallets 
    SET escrow_balance = escrow_balance + 30
    WHERE id = v_buyer_wallet.id;
    
    -- Refresh wallet state after correction
    SELECT * INTO v_buyer_wallet FROM public.wallets WHERE user_id = v_order.buyer_id FOR UPDATE;

    -- 5. Refund the 50 to buyer's available balance and subtract from escrow
    UPDATE public.wallets 
    SET available_balance = available_balance + v_payment.amount,
        escrow_balance = escrow_balance - v_payment.amount,
        updated_at = now()
    WHERE id = v_buyer_wallet.id;

    -- 6. Insert refund transaction
    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (
        v_buyer_wallet.id, 
        v_payment.buyer_id, 
        'refund', 
        v_payment.amount, 
        'success', 
        v_order.id::text, 
        'Escrow refunded to available balance (Admin Remediation)'
    );

    -- 7. Update payment status to refunded
    UPDATE public.payments 
    SET payment_status = 'refunded', refunded_at = now()
    WHERE id = v_payment.id;

    -- 8. Update order status to refunded
    UPDATE public.orders 
    SET status = 'cancelled'
    WHERE id = v_order_id;

    -- 9. Add timeline entry
    INSERT INTO public.order_timeline (order_id, status, notes)
    VALUES (v_order_id, 'cancelled', 'Administrative Remediation: Synthetic test order cancelled and funds returned to buyer. ₦2.50 fee retained as per policy.');

    -- 10. Close the synthetic dispute
    UPDATE public.disputes 
    SET status = 'resolved_buyer', resolution_notes = 'Administrative Remediation: Synthetic test dispute resolved.'
    WHERE order_id = v_order_id;

END;
$$;
