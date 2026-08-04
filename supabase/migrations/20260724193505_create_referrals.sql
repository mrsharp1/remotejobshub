CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    reward_amount NUMERIC NOT NULL DEFAULT 0,
    first_purchase_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT referrals_status_check CHECK (status IN ('pending', 'qualified', 'paid', 'cancelled')),
    CONSTRAINT referrals_users_different CHECK (referrer_id != referred_id),
    CONSTRAINT referrals_referred_id_unique UNIQUE (referred_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS referrals_referrer_id_idx ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS referrals_referred_id_idx ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS referrals_referral_code_idx ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS referrals_created_at_idx ON public.referrals(created_at);

-- Updated at trigger
DROP TRIGGER IF EXISTS trigger_set_referrals_updated_at ON public.referrals;
CREATE TRIGGER trigger_set_referrals_updated_at
BEFORE UPDATE ON public.referrals
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their referrals" ON public.referrals
    FOR SELECT USING (
        auth.uid() = referrer_id OR 
        auth.uid() = referred_id OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can insert referrals (when signing up)" ON public.referrals
    FOR INSERT WITH CHECK (
        auth.uid() = referred_id
    );

CREATE POLICY "Only admins can update referrals" ON public.referrals
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
