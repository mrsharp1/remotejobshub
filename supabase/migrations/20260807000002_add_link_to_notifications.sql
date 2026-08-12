-- Add link and metadata columns required by the modern notification UI
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS link TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Drop the restrictive type check constraint as the application has expanded notification types in src/features/notifications/types/index.ts
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;
