-- 011_messages.sql
-- Idempotent database migration to establish general messaging conversations schema

-- 1. Create Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  last_message_text TEXT,
  last_message_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Conversation Participants Table
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  unread_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  is_blocked BOOLEAN DEFAULT FALSE,
  last_read_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (conversation_id, user_id)
);

-- 3. Create General Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_read BOOLEAN DEFAULT FALSE
);

-- 4. Create Message Attachments Table
CREATE TABLE IF NOT EXISTS public.message_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_listing_id ON public.conversations(listing_id);
CREATE INDEX IF NOT EXISTS idx_participants_conversation_id ON public.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_attachments_message_id ON public.message_attachments(message_id);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Conversations: visible to participants or admin
DROP POLICY IF EXISTS "Select conversations policy" ON public.conversations;
CREATE POLICY "Select conversations policy" ON public.conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants 
      WHERE conversation_id = conversations.id AND user_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Conversation Participants: visible to participants or admin
DROP POLICY IF EXISTS "Select participants policy" ON public.conversation_participants;
CREATE POLICY "Select participants policy" ON public.conversation_participants
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Insert participants policy" ON public.conversation_participants;
CREATE POLICY "Insert participants policy" ON public.conversation_participants
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Update participants policy" ON public.conversation_participants;
CREATE POLICY "Update participants policy" ON public.conversation_participants
  FOR UPDATE USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Messages: visible to conversation participants
DROP POLICY IF EXISTS "Select messages policy" ON public.messages;
CREATE POLICY "Select messages policy" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants 
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Insert messages policy" ON public.messages;
CREATE POLICY "Insert messages policy" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
  );

-- Attachments: visible to conversation participants
DROP POLICY IF EXISTS "Select attachments policy" ON public.message_attachments;
CREATE POLICY "Select attachments policy" ON public.message_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversation_participants p ON p.conversation_id = m.conversation_id
      WHERE m.id = message_attachments.message_id AND p.user_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger: update conversation last message on message insert
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_text = NEW.message_text,
      last_message_sent_at = NEW.created_at,
      updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  
  -- Increment unread counts for all participants except sender
  UPDATE public.conversation_participants
  SET unread_count = unread_count + 1
  WHERE conversation_id = NEW.conversation_id AND user_id != NEW.sender_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_conversation ON public.messages;
CREATE TRIGGER trg_update_conversation
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();
