-- 20260809000000_fix_support_rls_recursion.sql

-- 1. Helper function to check if the conversation is a support conversation and the user is an admin
-- This breaks the planner cycle because it abstracts the conversations_v2 table lookup away from the 
-- conversation_participants_v2 and messages_v2 policies via a SECURITY DEFINER function.
CREATE OR REPLACE FUNCTION public.is_admin_for_support_conversation(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- 1. Check if user is an admin using the existing isolated helper
    IF NOT public.is_admin() THEN
        RETURN FALSE;
    END IF;

    -- 2. Check if the conversation is type = 'support'
    RETURN EXISTS (
        SELECT 1 FROM public.conversations_v2
        WHERE id = p_conversation_id AND type = 'support'
    );
END;
$$;

-- 2. Update conversation_participants_v2 policies to use the new helper, eliminating the subquery
DROP POLICY IF EXISTS "Users view participants v2" ON public.conversation_participants_v2;
CREATE POLICY "Users view participants v2" ON public.conversation_participants_v2
    FOR SELECT USING (
        public.is_conversation_participant_v2(conversation_id)
        OR public.is_admin_for_support_conversation(conversation_id)
    );

-- 3. Update messages_v2 policies to use the new helper, eliminating the subquery
DROP POLICY IF EXISTS "Users view messages v2" ON public.messages_v2;
CREATE POLICY "Users view messages v2" ON public.messages_v2
    FOR SELECT USING (
        public.is_conversation_participant_v2(conversation_id)
        OR public.is_admin_for_support_conversation(conversation_id)
    );

DROP POLICY IF EXISTS "Users insert messages v2" ON public.messages_v2;
CREATE POLICY "Users insert messages v2" ON public.messages_v2
    FOR INSERT WITH CHECK (
        (sender_id = auth.uid() OR (is_system = true AND auth.uid() IS NOT NULL)) AND 
        (
            public.is_conversation_participant_v2(conversation_id)
            OR public.is_admin_for_support_conversation(conversation_id)
        )
    );

-- 4. Update message_attachments_v2 policies to use the new helper
DROP POLICY IF EXISTS "Users view attachments v2" ON public.message_attachments_v2;
CREATE POLICY "Users view attachments v2" ON public.message_attachments_v2
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.messages_v2 m
            WHERE m.id = message_attachments_v2.message_id
            AND (
                public.is_conversation_participant_v2(m.conversation_id)
                OR public.is_admin_for_support_conversation(m.conversation_id)
            )
        )
    );

-- 5. Add SELECT policy for profiles so Admins can resolve "Deleted User" due to missing RLS read access
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        public.is_admin()
    );
