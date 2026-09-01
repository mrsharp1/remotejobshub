CREATE OR REPLACE FUNCTION public.handle_message_v2_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_participant record;
    v_admin record;
    v_conv_type text;
BEGIN
    SELECT type INTO v_conv_type FROM public.conversations_v2 WHERE id = NEW.conversation_id;

    -- Notify explicit participants (Buyer/Seller)
    FOR v_participant IN 
        SELECT user_id FROM public.conversation_participants_v2 
        WHERE conversation_id = NEW.conversation_id AND user_id != NEW.sender_id
    LOOP
        INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
        VALUES (
            v_participant.user_id,
            'New Message 💬',
            CASE WHEN length(NEW.message_text) > 60 THEN substring(NEW.message_text from 1 for 60) || '...' ELSE NEW.message_text END,
            'message',
            'message',
            'important',
            '/dashboard/messages?conversation=' || NEW.conversation_id,
            'message',
            NEW.id
        );
    END LOOP;

    -- Notify ALL admins if it is a support conversation
    IF v_conv_type = 'support' THEN
        FOR v_admin IN SELECT id FROM public.profiles WHERE role = 'admin' AND id != NEW.sender_id LOOP
            -- Prevent double notification if admin happens to be explicitly added
            IF NOT EXISTS (
                SELECT 1 FROM public.conversation_participants_v2 
                WHERE conversation_id = NEW.conversation_id AND user_id = v_admin.id
            ) THEN
                INSERT INTO public.notifications (user_id, title, message, type, category, priority, target_url, reference_type, reference_id)
                VALUES (
                    v_admin.id,
                    'New Support Message 🎧',
                    CASE WHEN length(NEW.message_text) > 60 THEN substring(NEW.message_text from 1 for 60) || '...' ELSE NEW.message_text END,
                    'message',
                    'message',
                    'important',
                    '/admin/messages?conversation=' || NEW.conversation_id,
                    'message',
                    NEW.id
                );
            END IF;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$;
