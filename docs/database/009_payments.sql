-- 009_payments.sql
-- Idempotent database migration to establish Payments tables

-- Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id),
  seller_id UUID NOT NULL REFERENCES public.profiles(id),
  paystack_reference TEXT NOT NULL UNIQUE,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed', 'released', 'refunded')),
  payment_method TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  gateway_response JSONB,
  paid_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_paystack_reference ON public.payments(paystack_reference);
CREATE INDEX IF NOT EXISTS idx_payments_buyer_id ON public.payments(buyer_id);
CREATE INDEX IF NOT EXISTS idx_payments_seller_id ON public.payments(seller_id);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Select payments policy" ON public.payments;
CREATE POLICY "Select payments policy" ON public.payments
  FOR SELECT USING (
    auth.uid() = buyer_id OR 
    auth.uid() = seller_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Insert payments policy" ON public.payments;
CREATE POLICY "Insert payments policy" ON public.payments
  FOR INSERT WITH CHECK (
    auth.uid() = buyer_id
  );

DROP POLICY IF EXISTS "Update payments policy" ON public.payments;
CREATE POLICY "Update payments policy" ON public.payments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
