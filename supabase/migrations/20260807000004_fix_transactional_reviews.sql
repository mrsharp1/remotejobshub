-- Drop the broken trigger that references NEW.target_id which doesn't exist
-- Notifications for reviews are handled robustly in review.service.ts
DROP TRIGGER IF EXISTS tg_review_notifications ON public.reviews;
DROP FUNCTION IF EXISTS public.handle_review_notifications();
