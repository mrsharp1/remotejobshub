CREATE TABLE IF NOT EXISTS public.order_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS order_timeline_order_id_idx ON public.order_timeline(order_id);
CREATE INDEX IF NOT EXISTS order_timeline_created_at_idx ON public.order_timeline(created_at);

-- Enable RLS
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- SELECT: Users can view timeline if they are the buyer/seller of the order, or an admin
CREATE POLICY "Users can view timeline for their orders" ON public.order_timeline
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_timeline.order_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
        OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- INSERT: Users can insert timeline if they are the buyer/seller of the order, or an admin
CREATE POLICY "Users can insert timeline for their orders" ON public.order_timeline
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
        OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- UPDATE: Users can update timeline if they are the buyer/seller of the order, or an admin
CREATE POLICY "Users can update timeline for their orders" ON public.order_timeline
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_timeline.order_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
        OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
