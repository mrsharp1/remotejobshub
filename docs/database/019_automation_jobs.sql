-- 019_automation_jobs.sql
-- Migration establishing schemas for background task orchestrator metadata and audit logs tracking

-- 1. Create Automation Jobs Table
CREATE TABLE IF NOT EXISTS public.automation_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'success', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Automation Audit Logs Table
CREATE TABLE IF NOT EXISTS public.automation_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.automation_jobs(id) ON DELETE CASCADE,
  job_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  log_message TEXT,
  executed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Admin trigger if manually executed
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Populate default scheduled tasks
INSERT INTO public.automation_jobs (name, description, next_run) VALUES
  ('Reconcile Wallet & Escrow', 'Performs double-ledger integrity checks across all escrow transactions and wallet balances.', now() + interval '1 day'),
  ('Expire Promotions & Featured Listings', 'Scans promotions, coupons and boosts listings to update active state parameters on expired dates.', now() + interval '1 hour'),
  ('Archive Stale Listings', 'Automatically moves listings with no user clicks or activity for 90 days to archived.', now() + interval '7 days'),
  ('Recalculate Seller Scores', 'Recomputes ratings, trust safety parameters, and verified status updates across seller profiles.', now() + interval '1 day'),
  ('Clean Temporary Uploads & Drafts', 'Purges expired notifications, abandoned listings drafts, and temporary file uploads.', now() + interval '3 days')
ON CONFLICT (name) DO NOTHING;

-- RLS Policies
ALTER TABLE public.automation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins overrides select & write
DROP POLICY IF EXISTS "Admin select automation jobs" ON public.automation_jobs;
CREATE POLICY "Admin select automation jobs" ON public.automation_jobs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admin write automation jobs" ON public.automation_jobs;
CREATE POLICY "Admin write automation jobs" ON public.automation_jobs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admin select automation logs" ON public.automation_audit_logs;
CREATE POLICY "Admin select automation logs" ON public.automation_audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admin write automation logs" ON public.automation_audit_logs;
CREATE POLICY "Admin write automation logs" ON public.automation_audit_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
