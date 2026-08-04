-- 20260726000002_add_pending_balance_to_wallets.sql
-- P1 FIX: Add 'pending_balance' column to wallets table.
-- The wallet service uses pending_balance to track funds in withdrawal-pending state.
-- This column was absent from the original wallet_foundation migration, causing
-- all requestWithdrawal, approveWithdrawal, and rejectWithdrawal operations to fail.

ALTER TABLE public.wallets
  ADD COLUMN IF NOT EXISTS pending_balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (pending_balance >= 0);

-- Backfill existing rows (all existing rows get 0 as default, which is correct)
UPDATE public.wallets SET pending_balance = 0.00 WHERE pending_balance IS NULL;

-- Add index for analytics queries that filter/aggregate by pending_balance
CREATE INDEX IF NOT EXISTS idx_wallets_pending_balance ON public.wallets(pending_balance);
