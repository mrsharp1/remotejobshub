-- 20260727000007_message_notification_triggers.sql
-- Trigger for order messages

CREATE OR REPLACE FUNCTION public.handle_order_message_notifications()
RETURNS TRIGGER AS $$
DECLARE
    v_order record;
    v_recipient_id uuid;
BEGIN
    -- Fetch the order
    SELECT * INTO v_order FROM public.orders WHERE id = NEW.order_id;
    
    -- Determine recipient (the other party in the order)
    IF NEW.sender_id = v_order.buyer_id THEN
        v_recipient_id := v_order.seller_id;
    ELSIF NEW.sender_id = v_order.seller_id THEN
        v_recipient_id := v_order.buyer_id;
    END IF;

    IF v_recipient_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id)
        VALUES (
            v_recipient_id,
            'New Message 💬',
            CASE 
                WHEN length(NEW.message_text) > 60 THEN substring(NEW.message_text from 1 for 60) || '...'
                ELSE NEW.message_text
            END,
            'system',
            'order',
            NEW.order_id::text
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Idempotent trigger creation
DO $$
BEGIN
    -- Only create the trigger if the table actually exists
    IF EXISTS (
        SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_messages'
    ) THEN
        DROP TRIGGER IF EXISTS tg_order_message_notifications ON public.order_messages;
        CREATE TRIGGER tg_order_message_notifications
            AFTER INSERT ON public.order_messages
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_order_message_notifications();
    END IF;
END $$;
