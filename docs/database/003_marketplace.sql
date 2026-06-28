-- 003_marketplace.sql
-- Idempotent database migration to initialize the Marketplace system

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Listings Table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  country TEXT NOT NULL,
  account_age TEXT,
  monthly_income NUMERIC DEFAULT 0,
  price NUMERIC NOT NULL,
  description TEXT,
  reason_for_sale TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'published', 'sold', 'archived')),
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  views INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Listing Images Table
CREATE TABLE IF NOT EXISTS public.listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Listing Tags Table
CREATE TABLE IF NOT EXISTS public.listing_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

-- Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_approval_status ON public.listings(approval_status);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_platform ON public.listings(platform);
CREATE INDEX IF NOT EXISTS idx_listings_country ON public.listings(country);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at);

CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON public.listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_tags_listing_id ON public.listing_tags(listing_id);

-- Update trigger for updated_at column
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_listings_updated_at ON public.listings;
CREATE TRIGGER trigger_set_listings_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Listings Table Policies
DROP POLICY IF EXISTS "Sellers can select own listings" ON public.listings;
CREATE POLICY "Sellers can select own listings" ON public.listings
  FOR SELECT USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Sellers can insert own listings" ON public.listings;
CREATE POLICY "Sellers can insert own listings" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Sellers can update own listings" ON public.listings;
CREATE POLICY "Sellers can update own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Sellers can delete own listings" ON public.listings;
CREATE POLICY "Sellers can delete own listings" ON public.listings
  FOR DELETE USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Anyone can select approved and published listings" ON public.listings;
CREATE POLICY "Anyone can select approved and published listings" ON public.listings
  FOR SELECT USING (approval_status = 'approved' AND status = 'published');

-- Listing Images Table Policies
DROP POLICY IF EXISTS "Anyone can select images of approved listings" ON public.listing_images;
CREATE POLICY "Anyone can select images of approved listings" ON public.listing_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE id = listing_images.listing_id
      AND (approval_status = 'approved' AND status = 'published' OR seller_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Sellers can manage images of own listings" ON public.listing_images;
CREATE POLICY "Sellers can manage images of own listings" ON public.listing_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE id = listing_images.listing_id AND seller_id = auth.uid()
    )
  );

-- Listing Tags Table Policies
DROP POLICY IF EXISTS "Anyone can select tags of approved listings" ON public.listing_tags;
CREATE POLICY "Anyone can select tags of approved listings" ON public.listing_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE id = listing_tags.listing_id
      AND (approval_status = 'approved' AND status = 'published' OR seller_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Sellers can manage tags of own listings" ON public.listing_tags;
CREATE POLICY "Sellers can manage tags of own listings" ON public.listing_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE id = listing_tags.listing_id AND seller_id = auth.uid()
    )
  );

-- Favorites Table Policies
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;
CREATE POLICY "Users can manage own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- Future Admin placeholder policies commented
-- CREATE POLICY "Admins can manage all listings" ON public.listings FOR ALL TO admin USING (true);
