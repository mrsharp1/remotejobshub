-- 20260803000002_repair_messaging_rls.sql
-- Safely repairs the catastrophic infinite recursion in the messaging RLS policies

-- 1. Create SECURITY DEFINER function to break the recursion
CREATE OR REPLACE FUNCTION public.is_conversation_participant(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.conversation_participants 
        WHERE conversation_id = p_conversation_id 
        AND user_id = auth.uid()
    );
END;
$$;

-- 2. Create the missing message_attachments table safely
CREATE TABLE IF NOT EXISTS public.message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Enable RLS on message_attachments (just in case)
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;

-- 4. Dynamically drop all existing broken policies on the messaging tables
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('conversations', 'conversation_participants', 'messages', 'message_attachments')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END
$$;

-- 5. Recreate safe policies using the SECURITY DEFINER function

-- CONVERSATIONS
CREATE POLICY "Users can view their conversations" ON public.conversations
    FOR SELECT USING (public.is_conversation_participant(id));

CREATE POLICY "Users can insert conversations" ON public.conversations
    FOR INSERT WITH CHECK (true); -- Required because participants are bound after insert

-- CONVERSATION PARTICIPANTS
CREATE POLICY "Users can view their conversation participants" ON public.conversation_participants
    FOR SELECT USING (public.is_conversation_participant(conversation_id));

CREATE POLICY "Users can insert conversation participants" ON public.conversation_participants
    FOR INSERT WITH CHECK (
        user_id = auth.uid() OR 
        public.is_conversation_participant(conversation_id) OR
        NOT EXISTS (
            SELECT 1 FROM public.conversation_participants cp 
            WHERE cp.conversation_id = conversation_participants.conversation_id
        )
    );

-- MESSAGES
CREATE POLICY "Users can view their messages" ON public.messages
    FOR SELECT USING (public.is_conversation_participant(conversation_id));

CREATE POLICY "Users can insert messages" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND 
        public.is_conversation_participant(conversation_id)
    );

CREATE POLICY "Users can update their messages" ON public.messages
    FOR UPDATE USING (sender_id = auth.uid());

-- MESSAGE ATTACHMENTS
CREATE POLICY "Users can view attachments" ON public.message_attachments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.messages m
            WHERE m.id = message_attachments.message_id
            AND public.is_conversation_participant(m.conversation_id)
        )
    );

CREATE POLICY "Users can insert attachments" ON public.message_attachments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.messages m
            WHERE m.id = message_id
            AND m.sender_id = auth.uid()
        )
    );

-- 6. Grant least-privilege table access
GRANT SELECT, INSERT ON TABLE public.message_attachments TO authenticated;
