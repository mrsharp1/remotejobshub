-- Phase 2: Transactional Reviews (Two-Sided Verified Reviews)

-- 1. Add new columns
ALTER TABLE public.reviews
ADD COLUMN reviewer_type VARCHAR(10) DEFAULT 'buyer' CHECK (reviewer_type IN ('buyer', 'seller')),
ADD COLUMN moderation_status VARCHAR(20) DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected'));

-- 2. Backfill existing records
UPDATE public.reviews
SET 
  reviewer_type = 'buyer',
  moderation_status = CASE 
    WHEN admin_hidden = true THEN 'rejected'
    ELSE 'approved'
  END;

-- 3. Enforce NOT NULL constraints
ALTER TABLE public.reviews
ALTER COLUMN reviewer_type SET NOT NULL,
ALTER COLUMN moderation_status SET NOT NULL;

-- 4. Add UNIQUE constraint (1 buyer review and 1 seller review per order)
CREATE UNIQUE INDEX reviews_order_reviewer_type_idx ON public.reviews(order_id, reviewer_type);

-- 5. Drop old policies
DROP POLICY IF EXISTS "Anyone can view non-hidden reviews" ON public.reviews;
DROP POLICY IF EXISTS "Buyers can insert reviews for their orders" ON public.reviews;

-- 6. Create new SELECT policy
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
    FOR SELECT USING (
        moderation_status = 'approved' OR
        auth.uid() = buyer_id OR
        auth.uid() = seller_id OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 7. Create new INSERT policy for Buyers
CREATE POLICY "Buyers can insert buyer reviews for completed orders" ON public.reviews
    FOR INSERT WITH CHECK (
        reviewer_type = 'buyer' AND
        auth.uid() = buyer_id AND
        EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.buyer_id = auth.uid() AND o.status = 'completed')
    );

-- 8. Create new INSERT policy for Sellers
CREATE POLICY "Sellers can insert seller reviews for completed orders" ON public.reviews
    FOR INSERT WITH CHECK (
        reviewer_type = 'seller' AND
        auth.uid() = seller_id AND
        EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.seller_id = auth.uid() AND o.status = 'completed')
    );

-- Existing policy "Sellers can update their replies" already exists and allows admin updates.
