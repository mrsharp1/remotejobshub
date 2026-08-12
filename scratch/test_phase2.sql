-- Test A
SELECT count(*) FROM information_schema.columns WHERE table_name = 'reviews' AND column_name IN ('reviewer_type', 'moderation_status');

-- Test B
-- Simulate anonymous access
set role anon;
-- This should only return approved reviews
SELECT count(*) FROM public.reviews;
reset role;

-- Test E
-- Check unique constraint
-- This relies on the index reviews_order_reviewer_type_idx we created
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'reviews' AND indexname = 'reviews_order_reviewer_type_idx';
