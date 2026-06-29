-- 012_wallets.sql
-- Migration file to establish platform wallets, credit ledger, and withdrawal cashout requests

-- 1. Create Wallets Table
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  available_balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (available_balance >= 0),
  pending_balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (pending_balance >= 0),
  escrow_balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (escrow_balance >= 0),
  bonus_credits NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (bonus_credits >= 0),
  referral_earnings NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (referral_earnings >= 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Wallet Transactions Table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'escrow_hold', 'escrow_release', 'bonus', 'referral', 'debit', 'credit')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Withdrawal Requests Table
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON public.wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_user_id ON public.withdrawal_requests(user_id);

-- Enable RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Wallets Policies
DROP POLICY IF EXISTS "Select wallet policy" ON public.wallets;
CREATE POLICY "Select wallet policy" ON public.wallets
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Update wallet policy" ON public.wallets;
CREATE POLICY "Update wallet policy" ON public.wallets
  FOR UPDATE USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Transactions Policies
DROP POLICY IF EXISTS "Select transactions policy" ON public.wallet_transactions;
CREATE POLICY "Select transactions policy" ON public.wallet_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.wallets 
      WHERE id = wallet_transactions.wallet_id AND user_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Insert transactions policy" ON public.wallet_transactions;
CREATE POLICY "Insert transactions policy" ON public.wallet_transactions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Withdrawal Requests Policies
DROP POLICY IF EXISTS "Select withdrawal policy" ON public.withdrawal_requests;
CREATE POLICY "Select withdrawal policy" ON public.withdrawal_requests
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Insert withdrawal policy" ON public.withdrawal_requests;
CREATE POLICY "Insert withdrawal policy" ON public.withdrawal_requests
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Update withdrawal policy" ON public.withdrawal_requests;
CREATE POLICY "Update withdrawal policy" ON public.withdrawal_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger: auto-provision wallet for new users
CREATE OR REPLACE FUNCTION public.handle_create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (user_id, available_balance, pending_balance, escrow_balance, bonus_credits, referral_earnings)
  VALUES (NEW.id, 0.00, 0.00, 0.00, 0.00, 0.00)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_create_user_wallet ON public.profiles;
CREATE TRIGGER trg_create_user_wallet
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_create_user_wallet();

-- Backfill wallets for existing profiles
INSERT INTO public.wallets (user_id, available_balance, pending_balance, escrow_balance, bonus_credits, referral_earnings)
SELECT id, 0.00, 0.00, 0.00, 0.00, 0.00 FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;
