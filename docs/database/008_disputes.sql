-- 008_disputes.sql
-- Idempotent database migration to establish Dispute Resolution tables

-- Create Disputes Table
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  opened_by UUID NOT NULL REFERENCES public.profiles(id),
  admin_id UUID REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved_buyer', 'resolved_seller', 'closed', 'rejected')),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Dispute Evidence Table
CREATE TABLE IF NOT EXISTS public.dispute_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  description TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Dispute Messages Table
CREATE TABLE IF NOT EXISTS public.dispute_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_disputes_order_id ON public.disputes(order_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_admin_id ON public.disputes(admin_id);
CREATE INDEX IF NOT EXISTS idx_dispute_evidence_dispute_id ON public.dispute_evidence(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_messages_dispute_id ON public.dispute_messages(dispute_id);

-- Enable RLS
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispute_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for disputes
DROP POLICY IF EXISTS "Select disputes policy" ON public.disputes;
CREATE POLICY "Select disputes policy" ON public.disputes
  FOR SELECT USING (
    auth.uid() = opened_by OR 
    auth.uid() = admin_id OR 
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND (buyer_id = auth.uid() OR seller_id = auth.uid())) OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Insert disputes policy" ON public.disputes;
CREATE POLICY "Insert disputes policy" ON public.disputes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND (buyer_id = auth.uid() OR seller_id = auth.uid()))
  );

DROP POLICY IF EXISTS "Update disputes policy" ON public.disputes;
CREATE POLICY "Update disputes policy" ON public.disputes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for dispute_evidence
DROP POLICY IF EXISTS "Select evidence policy" ON public.dispute_evidence;
CREATE POLICY "Select evidence policy" ON public.dispute_evidence
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.disputes WHERE id = dispute_id)
  );

DROP POLICY IF EXISTS "Insert evidence policy" ON public.dispute_evidence;
CREATE POLICY "Insert evidence policy" ON public.dispute_evidence
  FOR INSERT WITH CHECK (
    auth.uid() = submitted_by
  );

-- RLS Policies for dispute_messages
DROP POLICY IF EXISTS "Select messages policy" ON public.dispute_messages;
CREATE POLICY "Select messages policy" ON public.dispute_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.disputes WHERE id = dispute_id)
  );

DROP POLICY IF EXISTS "Insert messages policy" ON public.dispute_messages;
CREATE POLICY "Insert messages policy" ON public.dispute_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
  );
