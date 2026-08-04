CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL CONSTRAINT reviews_seller_id_fkey REFERENCES public.profiles(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL CONSTRAINT reviews_buyer_id_fkey REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    review TEXT NOT NULL,
    would_recommend BOOLEAN NOT NULL DEFAULT true,
    seller_reply TEXT,
    seller_reply_date TIMESTAMPTZ,
    admin_hidden BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS reviews_order_id_idx ON public.reviews(order_id);
CREATE INDEX IF NOT EXISTS reviews_listing_id_idx ON public.reviews(listing_id);
CREATE INDEX IF NOT EXISTS reviews_seller_id_idx ON public.reviews(seller_id);
CREATE INDEX IF NOT EXISTS reviews_buyer_id_idx ON public.reviews(buyer_id);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON public.reviews(rating);

-- Updated at trigger
DROP TRIGGER IF EXISTS trigger_set_reviews_updated_at ON public.reviews;
CREATE TRIGGER trigger_set_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view non-hidden reviews" ON public.reviews
    FOR SELECT USING (
        admin_hidden = false OR
        auth.uid() = buyer_id OR
        auth.uid() = seller_id OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Buyers can insert reviews for their orders" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() = buyer_id AND
        EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.buyer_id = auth.uid())
    );

CREATE POLICY "Sellers can update their replies" ON public.reviews
    FOR UPDATE USING (
        auth.uid() = seller_id OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
