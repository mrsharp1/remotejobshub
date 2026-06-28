-- 004_listing_extensions.sql
-- Idempotent database migration to extend listings with validation check booleans

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS original_email_included BOOLEAN DEFAULT FALSE;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS recovery_email_included BOOLEAN DEFAULT FALSE;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS phone_included BOOLEAN DEFAULT FALSE;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS identity_verified BOOLEAN DEFAULT FALSE;
