-- 010_reviews.sql
-- Idempotent database migration to establish Reviews tables and triggers

-- Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE UNIQUE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  review TEXT NOT NULL,
  would_recommend BOOLEAN DEFAULT TRUE,
  seller_reply TEXT,
  seller_reply_date TIMESTAMPTZ,
  admin_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON public.reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_seller_id ON public.reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_buyer_id ON public.reviews(buyer_id);

-- Check Order Completed Trigger
CREATE OR REPLACE FUNCTION check_order_completed_before_review()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = NEW.order_id AND status = 'completed'
  ) THEN
    RAISE EXCEPTION 'You can only review completed orders.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_order_completed ON public.reviews;
CREATE TRIGGER trg_check_order_completed
  BEFORE INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION check_order_completed_before_review();

-- Check Review Edit 7 Days Time Limit Trigger
CREATE OR REPLACE FUNCTION check_review_update_time_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure that review changes are only made within 7 days of initial creation
  IF OLD.created_at < now() - INTERVAL '7 days' THEN
    RAISE EXCEPTION 'Reviews can only be edited within 7 days of posting.';
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_review_update_limit ON public.reviews;
CREATE TRIGGER trg_check_review_update_limit
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION check_review_update_time_limit();

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Select reviews policy" ON public.reviews;
CREATE POLICY "Select reviews policy" ON public.reviews
  FOR SELECT USING (
    admin_hidden = FALSE OR
    auth.uid() = buyer_id OR
    auth.uid() = seller_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Insert reviews policy" ON public.reviews;
CREATE POLICY "Insert reviews policy" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = buyer_id
  );

DROP POLICY IF EXISTS "Update reviews policy" ON public.reviews;
CREATE POLICY "Update reviews policy" ON public.reviews
  FOR UPDATE USING (
    auth.uid() = buyer_id OR
    auth.uid() = seller_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
