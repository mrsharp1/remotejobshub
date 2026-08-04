-- 20260727000003_notification_triggers.sql
-- Create functions and triggers for system-generated notifications

CREATE OR REPLACE FUNCTION public.handle_order_status_notifications()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger if status changed
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;

    -- payment_received (buyer paid, notify seller)
    IF NEW.status = 'payment_received' THEN
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            NEW.seller_id,
            'Payment Secured in Escrow 💳',
            'Buyer has paid ₦' || NEW.amount::text || ' for your listing. Funds are secured in escrow. Please deliver credentials.',
            'payment',
            'order',
            NEW.id
        );
        
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            NEW.buyer_id,
            'Payment Confirmed',
            'Your payment has been successfully processed and secured in escrow.',
            'payment',
            'order',
            NEW.id
        );
    END IF;

    -- seller_processing (seller accepted, notify buyer)
    IF NEW.status = 'seller_processing' THEN
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            NEW.buyer_id,
            'Seller Delivering Credentials',
            'The seller has accepted and is processing your account transfer.',
            'order',
            'order',
            NEW.id
        );
    END IF;

    -- buyer_review (seller delivered, notify buyer)
    IF NEW.status = 'buyer_review' THEN
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            NEW.buyer_id,
            'Credentials Ready for Review',
            'The seller has delivered the account credentials. Please review and verify them.',
            'verification',
            'order',
            NEW.id
        );
    END IF;

    -- completed (buyer approved, notify seller)
    IF NEW.status = 'completed' THEN
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            NEW.seller_id,
            'Escrow Released',
            'Funds have been released from escrow to your wallet.',
            'escrow',
            'order',
            NEW.id
        );
    END IF;

    -- cancelled (order cancelled, notify both parties)
    IF NEW.status = 'cancelled' THEN
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            NEW.seller_id,
            'Order Cancelled',
            'Order #' || substring(NEW.id::text from 1 for 8) || ' has been cancelled.',
            'system',
            'order',
            NEW.id
        );
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            NEW.buyer_id,
            'Order Cancelled',
            'Order #' || substring(NEW.id::text from 1 for 8) || ' has been cancelled.',
            'system',
            'order',
            NEW.id
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tg_order_status_notifications ON public.orders;
CREATE TRIGGER tg_order_status_notifications
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_status_notifications();


-- Trigger for New Orders
CREATE OR REPLACE FUNCTION public.handle_new_order_notifications()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
    VALUES (
        NEW.seller_id,
        'New Order Received',
        'An order was placed for your listing.',
        'order',
        'order',
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tg_new_order_notifications ON public.orders;
CREATE TRIGGER tg_new_order_notifications
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_order_notifications();


-- Trigger for Disputes
CREATE OR REPLACE FUNCTION public.handle_dispute_notifications()
RETURNS TRIGGER AS $$
DECLARE
    v_order record;
BEGIN
    SELECT * INTO v_order FROM public.orders WHERE id = NEW.order_id;
    
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            v_order.buyer_id,
            'Dispute Case Opened ⚠️',
            'A dispute has been opened for Order #' || substring(v_order.id::text from 1 for 8) || '. A moderator will review it.',
            'system',
            'order',
            v_order.id
        );
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            v_order.seller_id,
            'Order Dispute Opened ⚠️',
            'A dispute has been opened for Order #' || substring(v_order.id::text from 1 for 8) || '. Please submit evidence.',
            'system',
            'order',
            v_order.id
        );
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'resolved' THEN
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            v_order.buyer_id,
            'Dispute Resolved',
            'The dispute for Order #' || substring(v_order.id::text from 1 for 8) || ' has been resolved.',
            'system',
            'order',
            v_order.id
        );
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            v_order.seller_id,
            'Dispute Resolved',
            'The dispute for Order #' || substring(v_order.id::text from 1 for 8) || ' has been resolved.',
            'system',
            'order',
            v_order.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tg_dispute_notifications ON public.disputes;
CREATE TRIGGER tg_dispute_notifications
    AFTER INSERT OR UPDATE ON public.disputes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_dispute_notifications();


-- Trigger for Reviews
CREATE OR REPLACE FUNCTION public.handle_review_notifications()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
    VALUES (
        NEW.target_id,
        'New Review Received',
        'You received a ' || NEW.rating::text || '-star review.',
        'reviews',
        'order',
        NEW.order_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tg_review_notifications ON public.reviews;
CREATE TRIGGER tg_review_notifications
    AFTER INSERT ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_review_notifications();
