CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL CONSTRAINT payments_buyer_id_fkey REFERENCES public.profiles(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL CONSTRAINT payments_seller_id_fkey REFERENCES public.profiles(id) ON DELETE CASCADE,
    paystack_reference TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    payment_method TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    gateway_response JSONB,
    paid_at TIMESTAMPTZ,
    released_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT payments_status_check CHECK (payment_status IN ('pending', 'success', 'failed', 'released', 'refunded'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS payments_order_id_idx ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS payments_buyer_id_idx ON public.payments(buyer_id);
CREATE INDEX IF NOT EXISTS payments_seller_id_idx ON public.payments(seller_id);
CREATE INDEX IF NOT EXISTS payments_paystack_reference_idx ON public.payments(paystack_reference);
CREATE INDEX IF NOT EXISTS payments_status_idx ON public.payments(payment_status);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (
        auth.uid() = buyer_id OR 
        auth.uid() = seller_id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can insert payments" ON public.payments
    FOR INSERT WITH CHECK (
        auth.uid() = buyer_id OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can update their payments" ON public.payments
    FOR UPDATE USING (
        auth.uid() = buyer_id OR 
        auth.uid() = seller_id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
