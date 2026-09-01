-- Create Promos table
CREATE TABLE IF NOT EXISTS public.promotions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  title text not null,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric not null check (discount_value >= 0),
  campaign_type text not null check (campaign_type in ('seasonal', 'seller_boost', 'flash_sale')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create Coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code <> ''),
  discount_type text not null check (discount_type in ('percentage', 'fixed', 'first_purchase', 'referral')),
  discount_value numeric not null check (discount_value >= 0),
  usage_limit integer,
  usage_count integer not null default 0,
  expires_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create Redemptions table
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_id uuid,
  discount_amount numeric not null check (discount_amount >= 0),
  created_at timestamptz not null default now()
);

-- Enable RLS
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

-- Policies for promotions
CREATE POLICY "Anyone can view active promotions" ON public.promotions
  FOR SELECT USING (is_active = true OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can manage promotions" ON public.promotions
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policies for coupons
CREATE POLICY "Authenticated users can view active coupons" ON public.coupons
  FOR SELECT TO authenticated USING (is_active = true OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can manage coupons" ON public.coupons
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
  
CREATE POLICY "Authenticated users can update coupon usage" ON public.coupons
  FOR UPDATE TO authenticated USING (is_active = true) WITH CHECK (is_active = true);

-- Policies for coupon_redemptions
CREATE POLICY "Users can view their own redemptions" ON public.coupon_redemptions
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can insert their own redemptions" ON public.coupon_redemptions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

