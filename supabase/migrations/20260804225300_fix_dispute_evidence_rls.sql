-- 20260804225300_fix_dispute_evidence_rls.sql
-- Fix dispute_evidence RLS insert policy to allow authenticated Admin users

DROP POLICY IF EXISTS "Users can submit evidence to their disputes" ON public.dispute_evidence;

CREATE POLICY "Users can submit evidence to their disputes" ON public.dispute_evidence
    FOR INSERT WITH CHECK (
        auth.uid() = submitted_by AND
        (
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
            ) OR
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role = 'admin'
            )
        )
    );
