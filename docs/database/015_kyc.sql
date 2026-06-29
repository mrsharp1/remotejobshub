-- 015_kyc.sql
-- Migration file to establish KYC and Seller Verifications tables

-- 1. Create Seller Verifications Table
CREATE TABLE IF NOT EXISTS public.seller_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')) DEFAULT 'pending',
  document_type TEXT NOT NULL CHECK (document_type IN ('government_id', 'passport', 'drivers_license', 'national_id')),
  selfie_url TEXT NOT NULL,
  proof_of_address_url TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Verification Documents Table
CREATE TABLE IF NOT EXISTS public.verification_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  verification_id UUID NOT NULL REFERENCES public.seller_verifications(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Verification Audit Logs Table
CREATE TABLE IF NOT EXISTS public.verification_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  verification_id UUID NOT NULL REFERENCES public.seller_verifications(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('submit', 'review', 'approve', 'reject', 'resubmit')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_kyc_user ON public.seller_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_status ON public.seller_verifications(status);

-- Enable RLS
ALTER TABLE public.seller_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Select kyc policy" ON public.seller_verifications;
CREATE POLICY "Select kyc policy" ON public.seller_verifications
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Insert kyc policy" ON public.seller_verifications;
CREATE POLICY "Insert kyc policy" ON public.seller_verifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Update kyc admin policy" ON public.seller_verifications;
CREATE POLICY "Update kyc admin policy" ON public.seller_verifications
  FOR UPDATE USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Function and trigger to auto-update profile verification status
CREATE OR REPLACE FUNCTION public.handle_seller_kyc_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' THEN
    UPDATE public.profiles
    SET seller_verified = TRUE, seller_since = now()
    WHERE id = NEW.user_id;
  ELSE
    UPDATE public.profiles
    SET seller_verified = FALSE
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_seller_kyc_status_change ON public.seller_verifications;
CREATE TRIGGER trg_seller_kyc_status_change
  AFTER INSERT OR UPDATE OF status ON public.seller_verifications
  FOR EACH ROW EXECUTE FUNCTION public.handle_seller_kyc_status_change();
