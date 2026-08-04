-- 20260727000006_more_notification_triggers.sql
-- Triggers for dispute evidence, dispute messages, and order messages

CREATE OR REPLACE FUNCTION public.handle_dispute_evidence_notifications()
RETURNS TRIGGER AS $$
DECLARE
    v_dispute record;
    v_order record;
    v_notify_target uuid;
BEGIN
    SELECT * INTO v_dispute FROM public.disputes WHERE id = NEW.dispute_id;
    SELECT * INTO v_order FROM public.orders WHERE id = v_dispute.order_id;
    
    IF NEW.submitted_by = v_order.buyer_id THEN
        v_notify_target := v_order.seller_id;
    ELSE
        v_notify_target := v_order.buyer_id;
    END IF;

    INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
    VALUES (
        v_notify_target,
        'Evidence Submitted 📁',
        'The counterparty has uploaded evidence regarding order #' || substring(v_order.id::text from 1 for 8) || '.',
        'system',
        'order',
        v_order.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tg_dispute_evidence_notifications ON public.dispute_evidence;
CREATE TRIGGER tg_dispute_evidence_notifications
    AFTER INSERT ON public.dispute_evidence
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_dispute_evidence_notifications();


CREATE OR REPLACE FUNCTION public.handle_dispute_message_notifications()
RETURNS TRIGGER AS $$
DECLARE
    v_dispute record;
    v_order record;
BEGIN
    SELECT * INTO v_dispute FROM public.disputes WHERE id = NEW.dispute_id;
    SELECT * INTO v_order FROM public.orders WHERE id = v_dispute.order_id;
    
    IF NEW.sender_id = v_dispute.admin_id THEN
        -- Admin sent message, notify both
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            v_order.buyer_id, 'Moderator Responded ⚖️', 'A dispute moderator sent a message regarding order #' || substring(v_order.id::text from 1 for 8) || '.', 'system', 'order', v_order.id
        );
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            v_order.seller_id, 'Moderator Responded ⚖️', 'A dispute moderator sent a message regarding order #' || substring(v_order.id::text from 1 for 8) || '.', 'system', 'order', v_order.id
        );
    ELSE
        -- User sent message, notify admin if needed, or other user. The codebase only notified on Admin message.
        -- We'll mirror that.
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tg_dispute_message_notifications ON public.dispute_messages;
CREATE TRIGGER tg_dispute_message_notifications
    AFTER INSERT ON public.dispute_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_dispute_message_notifications();
