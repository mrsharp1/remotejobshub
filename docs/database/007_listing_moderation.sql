-- 007_listing_moderation.sql
-- Idempotent database migration to extend listings with moderation parameters

ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS review_notes TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ;
