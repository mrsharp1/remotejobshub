CREATE TABLE IF NOT EXISTS public.dispute_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS dispute_messages_dispute_id_idx ON public.dispute_messages(dispute_id);
CREATE INDEX IF NOT EXISTS dispute_messages_sender_id_idx ON public.dispute_messages(sender_id);
CREATE INDEX IF NOT EXISTS dispute_messages_created_at_idx ON public.dispute_messages(created_at);

-- RLS
ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their disputes" ON public.dispute_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.disputes d
            WHERE d.id = dispute_messages.dispute_id
            AND (
                d.opened_by = auth.uid() OR 
                EXISTS (
                    SELECT 1 FROM public.orders o
                    WHERE o.id = d.order_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())
                )
            )
        ) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can insert messages to their disputes" ON public.dispute_messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.disputes d
            WHERE d.id = dispute_id
            AND (
                d.opened_by = auth.uid() OR 
                EXISTS (
                    SELECT 1 FROM public.orders o
                    WHERE o.id = d.order_id AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())
                )
            )
        )
    );
