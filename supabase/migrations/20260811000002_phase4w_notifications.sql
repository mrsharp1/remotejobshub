-- Migration for Phase 4W Unified Notifications
-- Add canonical category, priority, and target_url fields

ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT,
ADD COLUMN IF NOT EXISTS target_url TEXT;

-- Enforce priority domain if provided
ALTER TABLE public.notifications
ADD CONSTRAINT notifications_priority_check 
CHECK (priority IS NULL OR priority IN ('critical', 'important', 'informational', 'promotional'));

-- Backfill target_url with existing link values
UPDATE public.notifications
SET target_url = link
WHERE target_url IS NULL AND link IS NOT NULL;

-- Enable Realtime for the notifications table so the frontend can listen to INSERTs
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;
