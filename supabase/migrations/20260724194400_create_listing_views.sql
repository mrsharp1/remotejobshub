CREATE TABLE IF NOT EXISTS public.listing_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS listing_views_user_id_idx ON public.listing_views(user_id);
CREATE INDEX IF NOT EXISTS listing_views_listing_id_idx ON public.listing_views(listing_id);
CREATE INDEX IF NOT EXISTS listing_views_viewed_at_idx ON public.listing_views(viewed_at);

-- RLS
ALTER TABLE public.listing_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own views" ON public.listing_views
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own views" ON public.listing_views
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can select all views" ON public.listing_views
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
