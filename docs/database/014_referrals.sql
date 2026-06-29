-- 014_referrals.sql
-- Migration file to establish Referrals and Affiliate rewards tracking

-- 1. Extend profiles to support custom referral codes
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Function to generate a unique random referral code
CREATE OR REPLACE FUNCTION public.generate_unique_referral_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  done BOOLEAN := FALSE;
BEGIN
  WHILE NOT done LOOP
    new_code := UPPER(SUBSTRING(MD5(random()::text) FROM 1 FOR 8));
    -- Verify uniqueness
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = new_code) THEN
      done := TRUE;
    END IF;
  END LOOP;
  RETURN new_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to allocate referral code on profile creation
CREATE OR REPLACE FUNCTION public.handle_create_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := public.generate_unique_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_create_referral_code ON public.profiles;
CREATE TRIGGER trg_create_referral_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_create_referral_code();

-- Backfill existing profiles with referral codes
UPDATE public.profiles
SET referral_code = public.generate_unique_referral_code()
WHERE referral_code IS NULL;

-- 2. Create Referrals Table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'qualified', 'paid', 'cancelled')) DEFAULT 'pending',
  reward_amount NUMERIC(12, 2) DEFAULT 1000.00, -- Default reward e.g. ₦1,000 or $10
  first_purchase_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Referral Rewards Table
CREATE TABLE IF NOT EXISTS public.referral_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_id UUID UNIQUE NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_rewards_status ON public.referral_rewards(status);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Select referrals policy" ON public.referrals;
CREATE POLICY "Select referrals policy" ON public.referrals
  FOR SELECT USING (
    referrer_id = auth.uid() OR
    referred_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Insert referrals policy" ON public.referrals;
CREATE POLICY "Insert referrals policy" ON public.referrals
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Select rewards policy" ON public.referral_rewards;
CREATE POLICY "Select rewards policy" ON public.referral_rewards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.referrals 
      WHERE id = referral_id AND (referrer_id = auth.uid() OR referred_id = auth.uid())
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Modify rewards admin policy" ON public.referral_rewards;
CREATE POLICY "Modify rewards admin policy" ON public.referral_rewards
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
