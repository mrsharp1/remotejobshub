-- 20260804000000_messaging_v2.sql
-- Parallel deployment of unified messaging engine V2

-- 1. Create Core Tables
CREATE TABLE IF NOT EXISTS public.conversations_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('listing', 'order', 'dispute', 'support')),
    listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    dispute_id UUID REFERENCES public.disputes(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    last_message_id UUID, -- Foreign key added later to avoid circular dependency
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.conversation_participants_v2 (
    conversation_id UUID NOT NULL REFERENCES public.conversations_v2(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'participant',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_read_at TIMESTAMPTZ,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations_v2(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    message_text TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text',
    is_system BOOLEAN NOT NULL DEFAULT false,
    event_type TEXT,
    event_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.message_attachments_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.messages_v2(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_type TEXT,
    file_size BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add Circular Foreign Key for last_message_id
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_last_message' 
        AND table_name = 'conversations_v2'
    ) THEN 
        ALTER TABLE public.conversations_v2
        ADD CONSTRAINT fk_last_message
        FOREIGN KEY (last_message_id)
        REFERENCES public.messages_v2(id)
        ON DELETE SET NULL;
    END IF; 
END $$;

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_conv_v2_type ON public.conversations_v2(type);
CREATE INDEX IF NOT EXISTS idx_conv_v2_listing ON public.conversations_v2(listing_id);
CREATE INDEX IF NOT EXISTS idx_conv_v2_order ON public.conversations_v2(order_id);
CREATE INDEX IF NOT EXISTS idx_conv_v2_dispute ON public.conversations_v2(dispute_id);
CREATE INDEX IF NOT EXISTS idx_conv_part_v2_user ON public.conversation_participants_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_v2_conv ON public.messages_v2(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_v2_created_at ON public.messages_v2(created_at);
CREATE INDEX IF NOT EXISTS idx_attachments_v2_msg ON public.message_attachments_v2(message_id);

-- 4. Triggers (updated_at)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'handle_conversations_v2_updated_at'
    ) THEN
        CREATE TRIGGER handle_conversations_v2_updated_at
        BEFORE UPDATE ON public.conversations_v2
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'handle_messages_v2_updated_at'
    ) THEN
        CREATE TRIGGER handle_messages_v2_updated_at
        BEFORE UPDATE ON public.messages_v2
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
END $$;

-- 5. RLS Policies
ALTER TABLE public.conversations_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments_v2 ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_conversation_participant_v2(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.conversation_participants_v2 
        WHERE conversation_id = p_conversation_id 
        AND user_id = auth.uid()
    );
END;
$$;

-- conversations_v2 RLS
DROP POLICY IF EXISTS "Users view their conversations v2" ON public.conversations_v2;
CREATE POLICY "Users view their conversations v2" ON public.conversations_v2
    FOR SELECT USING (public.is_conversation_participant_v2(id));

DROP POLICY IF EXISTS "Users insert conversations v2" ON public.conversations_v2;
CREATE POLICY "Users insert conversations v2" ON public.conversations_v2
    FOR INSERT WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users update their conversations v2" ON public.conversations_v2;
CREATE POLICY "Users update their conversations v2" ON public.conversations_v2
    FOR UPDATE USING (public.is_conversation_participant_v2(id));

-- conversation_participants_v2 RLS
DROP POLICY IF EXISTS "Users view participants v2" ON public.conversation_participants_v2;
CREATE POLICY "Users view participants v2" ON public.conversation_participants_v2
    FOR SELECT USING (public.is_conversation_participant_v2(conversation_id));

DROP POLICY IF EXISTS "Users insert participants v2" ON public.conversation_participants_v2;
CREATE POLICY "Users insert participants v2" ON public.conversation_participants_v2
    FOR INSERT WITH CHECK (
        user_id = auth.uid() OR 
        public.is_conversation_participant_v2(conversation_id) OR
        NOT EXISTS (
            SELECT 1 FROM public.conversation_participants_v2 cp 
            WHERE cp.conversation_id = conversation_participants_v2.conversation_id
        )
    );

DROP POLICY IF EXISTS "Users update participants v2" ON public.conversation_participants_v2;
CREATE POLICY "Users update participants v2" ON public.conversation_participants_v2
    FOR UPDATE USING (user_id = auth.uid());

-- messages_v2 RLS
DROP POLICY IF EXISTS "Users view messages v2" ON public.messages_v2;
CREATE POLICY "Users view messages v2" ON public.messages_v2
    FOR SELECT USING (public.is_conversation_participant_v2(conversation_id));

DROP POLICY IF EXISTS "Users insert messages v2" ON public.messages_v2;
CREATE POLICY "Users insert messages v2" ON public.messages_v2
    FOR INSERT WITH CHECK (
        (sender_id = auth.uid() OR (is_system = true AND auth.uid() IS NOT NULL)) AND 
        public.is_conversation_participant_v2(conversation_id)
    );

DROP POLICY IF EXISTS "Users update messages v2" ON public.messages_v2;
CREATE POLICY "Users update messages v2" ON public.messages_v2
    FOR UPDATE USING (sender_id = auth.uid());

-- message_attachments_v2 RLS
DROP POLICY IF EXISTS "Users view attachments v2" ON public.message_attachments_v2;
CREATE POLICY "Users view attachments v2" ON public.message_attachments_v2
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.messages_v2 m
            WHERE m.id = message_attachments_v2.message_id
            AND public.is_conversation_participant_v2(m.conversation_id)
        )
    );

DROP POLICY IF EXISTS "Users insert attachments v2" ON public.message_attachments_v2;
CREATE POLICY "Users insert attachments v2" ON public.message_attachments_v2
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.messages_v2 m
            WHERE m.id = message_id
            AND m.sender_id = auth.uid()
        )
    );

-- 6. Permissions
GRANT SELECT, INSERT, UPDATE ON TABLE public.conversations_v2 TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.conversation_participants_v2 TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.messages_v2 TO authenticated;
GRANT SELECT, INSERT ON TABLE public.message_attachments_v2 TO authenticated;

-- 7. Realtime Publication
-- Safely add only if it doesn't already exist in publication (to avoid duplicate object errors)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_rel pr 
        JOIN pg_class c ON pr.prrelid = c.oid 
        JOIN pg_publication p ON p.oid = pr.prpubid 
        WHERE p.pubname = 'supabase_realtime' AND c.relname = 'messages_v2'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE messages_v2;
    END IF;
END
$$;
