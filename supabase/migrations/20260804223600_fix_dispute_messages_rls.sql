-- 20260804223600_fix_dispute_messages_rls.sql
-- Fix dispute_messages RLS insert policy to allow authenticated Admin users

DROP POLICY IF EXISTS "Users can insert messages to their disputes" ON public.dispute_messages;

CREATE POLICY "Users can insert messages to their disputes" ON public.dispute_messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
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
