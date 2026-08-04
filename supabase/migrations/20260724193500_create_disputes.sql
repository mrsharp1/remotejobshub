CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    opened_by UUID NOT NULL CONSTRAINT disputes_opened_by_fkey REFERENCES public.profiles(id) ON DELETE CASCADE,
    admin_id UUID CONSTRAINT disputes_admin_id_fkey REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT disputes_status_check CHECK (status IN ('pending', 'under_review', 'resolved_buyer', 'resolved_seller', 'closed', 'rejected'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS disputes_order_id_idx ON public.disputes(order_id);
CREATE INDEX IF NOT EXISTS disputes_opened_by_idx ON public.disputes(opened_by);
CREATE INDEX IF NOT EXISTS disputes_admin_id_idx ON public.disputes(admin_id);

-- Updated at trigger (assuming set_updated_at() was created in marketplace.sql)
DROP TRIGGER IF EXISTS trigger_set_disputes_updated_at ON public.disputes;
CREATE TRIGGER trigger_set_disputes_updated_at
BEFORE UPDATE ON public.disputes
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their disputes" ON public.disputes
    FOR SELECT USING (
        auth.uid() = opened_by OR 
        EXISTS (SELECT 1 FROM public.orders WHERE id = disputes.order_id AND (buyer_id = auth.uid() OR seller_id = auth.uid())) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can open disputes" ON public.disputes
    FOR INSERT WITH CHECK (
        auth.uid() = opened_by OR 
        EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND (buyer_id = auth.uid() OR seller_id = auth.uid()))
    );

CREATE POLICY "Users and admins can update disputes" ON public.disputes
    FOR UPDATE USING (
        auth.uid() = opened_by OR 
        EXISTS (SELECT 1 FROM public.orders WHERE id = disputes.order_id AND (buyer_id = auth.uid() OR seller_id = auth.uid())) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
