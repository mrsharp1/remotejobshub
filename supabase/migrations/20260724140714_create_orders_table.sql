CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL CONSTRAINT orders_buyer_id_fkey REFERENCES public.profiles(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL CONSTRAINT orders_seller_id_fkey REFERENCES public.profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL CONSTRAINT orders_listing_id_fkey REFERENCES public.listings(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT orders_status_check CHECK (status IN ('pending', 'payment_received', 'seller_processing', 'buyer_review', 'completed', 'cancelled', 'disputed'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS orders_buyer_id_idx ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS orders_seller_id_idx ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS orders_listing_id_idx ON public.orders(listing_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (
        auth.uid() = buyer_id OR 
        auth.uid() = seller_id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Buyers can create orders" ON public.orders
    FOR INSERT WITH CHECK (
        auth.uid() = buyer_id
    );

CREATE POLICY "Users can update their orders" ON public.orders
    FOR UPDATE USING (
        auth.uid() = buyer_id OR 
        auth.uid() = seller_id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can delete orders" ON public.orders
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
