CREATE TABLE IF NOT EXISTS public.dispute_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
    submitted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    file_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS dispute_evidence_dispute_id_idx ON public.dispute_evidence(dispute_id);
CREATE INDEX IF NOT EXISTS dispute_evidence_submitted_by_idx ON public.dispute_evidence(submitted_by);
CREATE INDEX IF NOT EXISTS dispute_evidence_created_at_idx ON public.dispute_evidence(created_at);

-- RLS
ALTER TABLE public.dispute_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view evidence for their disputes" ON public.dispute_evidence
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.disputes d
            WHERE d.id = dispute_evidence.dispute_id
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

CREATE POLICY "Users can submit evidence to their disputes" ON public.dispute_evidence
    FOR INSERT WITH CHECK (
        auth.uid() = submitted_by AND
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
