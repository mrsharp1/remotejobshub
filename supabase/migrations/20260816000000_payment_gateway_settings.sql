-- Migration for payment_gateway_settings

CREATE TABLE IF NOT EXISTS public.payment_gateway_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    live_public_key text NOT NULL,
    live_secret_key text NOT NULL,
    is_active boolean DEFAULT true,
    updated_at timestamptz DEFAULT now()
);

-- Ensure only one active config
CREATE UNIQUE INDEX IF NOT EXISTS payment_gateway_active_idx ON public.payment_gateway_settings (is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.payment_gateway_settings ENABLE ROW LEVEL SECURITY;

-- NO POLICIES ARE CREATED.
-- By default, this means:
-- Anonymous users: NO ACCESS
-- Authenticated users: NO ACCESS
-- Only the Service Role Key can SELECT, INSERT, UPDATE, or DELETE records in this table.
-- This ensures the live_secret_key is never exposed to any client.
