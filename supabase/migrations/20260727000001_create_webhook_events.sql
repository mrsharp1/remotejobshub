-- 20260727000001_create_webhook_events.sql
-- Creates an audit log table for all verified Paystack webhook events.
-- Purpose:
--   1. Provides a second idempotency guard independent of wallet_transactions
--      (defence-in-depth against replay attacks — W-5 from webhook audit)
--   2. Creates a financial audit trail for compliance and debugging
--   3. Allows admin review of all webhook events received
--
-- RLS: Service role (edge function) writes via bypass; admins can read.
-- No authenticated INSERT/UPDATE policy — only service_role may write.

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type          TEXT        NOT NULL,
  paystack_reference  TEXT,
  payload             JSONB       NOT NULL,
  processed           BOOLEAN     NOT NULL DEFAULT false,
  processing_error    TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Unique index: prevents recording the same event+reference combination twice.
--    This is the second idempotency layer (W-5 / W-9).
CREATE UNIQUE INDEX IF NOT EXISTS idx_webhook_events_reference_event
  ON public.webhook_events (event_type, paystack_reference)
  WHERE paystack_reference IS NOT NULL;

-- 3. Index on processed flag for admin queries (e.g. "show all failed events")
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed
  ON public.webhook_events (processed);

-- 4. Index on created_at for time-range queries and cleanup jobs
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at
  ON public.webhook_events (created_at);

-- 5. Enable Row Level Security
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- 6. Admin-only SELECT policy
--    Only admins may read webhook events. No public access.
DROP POLICY IF EXISTS "Admins can read webhook events" ON public.webhook_events;
CREATE POLICY "Admins can read webhook events" ON public.webhook_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- No INSERT/UPDATE/DELETE policies for authenticated users.
-- The edge function uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS.
-- This means only the webhook edge function (via service role) can write to this table.
-- Authenticated users and the frontend have zero write access.
