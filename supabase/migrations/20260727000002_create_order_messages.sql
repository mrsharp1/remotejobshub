-- 20260727000002_create_order_messages.sql
-- Fix OS-2: Creates the missing order_messages table referenced in order.service.ts

CREATE TABLE IF NOT EXISTS public.order_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS order_messages_order_id_idx ON public.order_messages(order_id);
CREATE INDEX IF NOT EXISTS order_messages_created_at_idx ON public.order_messages(created_at);

-- Enable RLS
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only read messages for orders they are a part of (buyer or seller) or if admin
CREATE POLICY "Users can read order messages" ON public.order_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_messages.order_id
            AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())
        ) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Users can only insert messages for orders they are a part of
CREATE POLICY "Users can insert order messages" ON public.order_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_id
            AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())
        )
    );
