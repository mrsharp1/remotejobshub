-- Add soft-delete mechanism for support conversations
ALTER TABLE public.conversations_v2 
ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX idx_conv_v2_archived ON public.conversations_v2(is_archived);
