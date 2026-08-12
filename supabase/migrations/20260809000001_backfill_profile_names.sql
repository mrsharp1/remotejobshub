-- Backfill public.profiles.full_name from auth.users.raw_user_meta_data->>'full_name'
-- Only applies where profiles.full_name IS NULL and the Auth metadata contains a non-empty full name
UPDATE public.profiles p
SET full_name = u.raw_user_meta_data->>'full_name'
FROM auth.users u
WHERE p.id = u.id
  AND p.full_name IS NULL
  AND NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), '') IS NOT NULL;
