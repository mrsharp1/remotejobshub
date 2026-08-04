CREATE TABLE IF NOT EXISTS public.referral_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT referral_rewards_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS referral_rewards_referral_id_idx ON public.referral_rewards(referral_id);
CREATE INDEX IF NOT EXISTS referral_rewards_status_idx ON public.referral_rewards(status);
CREATE INDEX IF NOT EXISTS referral_rewards_created_at_idx ON public.referral_rewards(created_at);

-- Updated at trigger
DROP TRIGGER IF EXISTS trigger_set_referral_rewards_updated_at ON public.referral_rewards;
CREATE TRIGGER trigger_set_referral_rewards_updated_at
BEFORE UPDATE ON public.referral_rewards
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their referral rewards" ON public.referral_rewards
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.referrals r 
            WHERE r.id = referral_rewards.referral_id AND r.referrer_id = auth.uid()
        ) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can update referral rewards" ON public.referral_rewards
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Only admins can insert referral rewards" ON public.referral_rewards
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
