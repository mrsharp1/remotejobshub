-- 20260808235000_messaging_support_rls.sql

-- 1. Helper function to check if viewer is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$;

-- 2. conversations_v2 RLS
DROP POLICY IF EXISTS "Users view their conversations v2" ON public.conversations_v2;
CREATE POLICY "Users view their conversations v2" ON public.conversations_v2
    FOR SELECT USING (
        public.is_conversation_participant_v2(id) 
        OR (type = 'support' AND public.is_admin())
    );

DROP POLICY IF EXISTS "Users update their conversations v2" ON public.conversations_v2;
CREATE POLICY "Users update their conversations v2" ON public.conversations_v2
    FOR UPDATE USING (
        public.is_conversation_participant_v2(id)
        OR (type = 'support' AND public.is_admin())
    );

-- 3. conversation_participants_v2 RLS
DROP POLICY IF EXISTS "Users view participants v2" ON public.conversation_participants_v2;
CREATE POLICY "Users view participants v2" ON public.conversation_participants_v2
    FOR SELECT USING (
        public.is_conversation_participant_v2(conversation_id)
        OR (
            EXISTS (
                SELECT 1 FROM public.conversations_v2 c
                WHERE c.id = conversation_participants_v2.conversation_id AND c.type = 'support'
            ) AND public.is_admin()
        )
    );

-- 4. messages_v2 RLS
DROP POLICY IF EXISTS "Users view messages v2" ON public.messages_v2;
CREATE POLICY "Users view messages v2" ON public.messages_v2
    FOR SELECT USING (
        public.is_conversation_participant_v2(conversation_id)
        OR (
            EXISTS (
                SELECT 1 FROM public.conversations_v2 c
                WHERE c.id = messages_v2.conversation_id AND c.type = 'support'
            ) AND public.is_admin()
        )
    );

DROP POLICY IF EXISTS "Users insert messages v2" ON public.messages_v2;
CREATE POLICY "Users insert messages v2" ON public.messages_v2
    FOR INSERT WITH CHECK (
        (sender_id = auth.uid() OR (is_system = true AND auth.uid() IS NOT NULL)) AND 
        (
            public.is_conversation_participant_v2(conversation_id)
            OR (
                EXISTS (
                    SELECT 1 FROM public.conversations_v2 c
                    WHERE c.id = conversation_id AND c.type = 'support'
                ) AND public.is_admin()
            )
        )
    );

-- 5. message_attachments_v2 RLS
DROP POLICY IF EXISTS "Users view attachments v2" ON public.message_attachments_v2;
CREATE POLICY "Users view attachments v2" ON public.message_attachments_v2
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.messages_v2 m
            WHERE m.id = message_attachments_v2.message_id
            AND (
                public.is_conversation_participant_v2(m.conversation_id)
                OR (
                    EXISTS (
                        SELECT 1 FROM public.conversations_v2 c
                        WHERE c.id = m.conversation_id AND c.type = 'support'
                    ) AND public.is_admin()
                )
            )
        )
    );
