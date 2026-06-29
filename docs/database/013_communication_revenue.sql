-- 013_communication_revenue.sql
-- Migration file to establish Targeted Broadcasts, Notification preferences, and Revenue Share Agreements

-- 1. Create Broadcasts Table
CREATE TABLE IF NOT EXISTS public.broadcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  audience_filter TEXT NOT NULL CHECK (audience_filter IN ('everyone', 'buyers', 'sellers', 'verified_sellers', 'no_purchase', 'active_orders', 'completed_orders')),
  image_url TEXT,
  link_url TEXT,
  scheduled_at TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  orders_enabled BOOLEAN DEFAULT TRUE,
  payments_enabled BOOLEAN DEFAULT TRUE,
  messages_enabled BOOLEAN DEFAULT TRUE,
  promotions_enabled BOOLEAN DEFAULT TRUE,
  updates_enabled BOOLEAN DEFAULT TRUE,
  announcements_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Seller Revenue Agreements Table
CREATE TABLE IF NOT EXISTS public.seller_revenue_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  revenue_plan TEXT NOT NULL CHECK (revenue_plan IN ('OptionA', 'OptionB')),
  percentage NUMERIC(4, 2) NOT NULL CHECK (percentage >= 0),
  bonus_eligible BOOLEAN DEFAULT FALSE,
  accepted_at TIMESTAMPTZ DEFAULT now(),
  agreement_version TEXT NOT NULL DEFAULT '1.0'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_broadcasts_created_at ON public.broadcasts(created_at);
CREATE INDEX IF NOT EXISTS idx_preferences_user_id ON public.notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_agreements_user_id ON public.seller_revenue_agreements(user_id);

-- Enable RLS
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_revenue_agreements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Broadcasts: visible to everyone, insertable by admins only
DROP POLICY IF EXISTS "Select broadcasts policy" ON public.broadcasts;
CREATE POLICY "Select broadcasts policy" ON public.broadcasts
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Insert broadcasts policy" ON public.broadcasts;
CREATE POLICY "Insert broadcasts policy" ON public.broadcasts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Preferences: user only
DROP POLICY IF EXISTS "Select preferences policy" ON public.notification_preferences;
CREATE POLICY "Select preferences policy" ON public.notification_preferences
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Update preferences policy" ON public.notification_preferences;
CREATE POLICY "Update preferences policy" ON public.notification_preferences
  FOR UPDATE USING (user_id = auth.uid());

-- Seller Agreements: user and admin
DROP POLICY IF EXISTS "Select agreements policy" ON public.seller_revenue_agreements;
CREATE POLICY "Select agreements policy" ON public.seller_revenue_agreements
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Insert agreements policy" ON public.seller_revenue_agreements;
CREATE POLICY "Insert agreements policy" ON public.seller_revenue_agreements
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Trigger: auto-create preferences for new profiles
CREATE OR REPLACE FUNCTION public.handle_create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_create_user_preferences ON public.profiles;
CREATE TRIGGER trg_create_user_preferences
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_create_user_preferences();

-- Backfill preferences
INSERT INTO public.notification_preferences (user_id)
SELECT id FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;
