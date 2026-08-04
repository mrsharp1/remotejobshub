-- Migration to create seller_revenue_agreements

CREATE TABLE IF NOT EXISTS public.seller_revenue_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  revenue_plan TEXT NOT NULL CHECK (revenue_plan IN ('OptionA', 'OptionB')),
  percentage NUMERIC(4, 2) NOT NULL CHECK (percentage >= 0),
  bonus_eligible BOOLEAN DEFAULT FALSE,
  accepted_at TIMESTAMPTZ DEFAULT now(),
  agreement_version TEXT NOT NULL DEFAULT '1.0'
);

CREATE INDEX IF NOT EXISTS idx_agreements_user_id ON public.seller_revenue_agreements(user_id);

ALTER TABLE public.seller_revenue_agreements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Select agreements policy" ON public.seller_revenue_agreements;
CREATE POLICY "Select agreements policy" ON public.seller_revenue_agreements
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Insert agreements policy" ON public.seller_revenue_agreements;
CREATE POLICY "Insert agreements policy" ON public.seller_revenue_agreements
  FOR INSERT WITH CHECK (user_id = auth.uid());
