-- Clear all stale push subscriptions because the VAPID keys have been rotated.
-- Old subscriptions are invalid and will be rejected by the push services.
TRUNCATE TABLE public.push_subscriptions;
