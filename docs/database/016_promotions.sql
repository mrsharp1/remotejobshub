-- 016_promotions.sql
-- Migration file to establish marketing engine, campaigns, coupons, and redemption schemas

-- 1. Create Campaigns & Promotions Table
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Creator (admin or seller)
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  campaign_type TEXT NOT NULL CHECK (campaign_type IN ('seasonal', 'seller_boost', 'flash_sale')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'first_purchase', 'referral')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  usage_limit INTEGER CHECK (usage_limit > 0),
  remaining_uses INTEGER CHECK (remaining_uses >= 0),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Coupon Redemptions Table
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_applied NUMERIC NOT NULL CHECK (discount_applied >= 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Promotional Banners Table
CREATE TABLE IF NOT EXISTS public.promotional_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotional_banners ENABLE ROW LEVEL SECURITY;

-- Grant Select accesses publicly
DROP POLICY IF EXISTS "Public select promotions" ON public.promotions;
CREATE POLICY "Public select promotions" ON public.promotions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public select coupons" ON public.coupons;
CREATE POLICY "Public select coupons" ON public.coupons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Select own coupon redemptions" ON public.coupon_redemptions;
CREATE POLICY "Select own coupon redemptions" ON public.coupon_redemptions
  FOR SELECT USING (
    buyer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Insert own coupon redemptions" ON public.coupon_redemptions;
CREATE POLICY "Insert own coupon redemptions" ON public.coupon_redemptions
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Public select banners" ON public.promotional_banners;
CREATE POLICY "Public select banners" ON public.promotional_banners FOR SELECT USING (true);

-- Admin updates overrides
DROP POLICY IF EXISTS "Admin write promotions" ON public.promotions;
CREATE POLICY "Admin write promotions" ON public.promotions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admin write coupons" ON public.coupons;
CREATE POLICY "Admin write coupons" ON public.coupons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admin write banners" ON public.promotional_banners;
CREATE POLICY "Admin write banners" ON public.promotional_banners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
