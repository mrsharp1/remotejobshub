-- Migration: Create CMS Written Reviews and Video Testimonials

CREATE TABLE IF NOT EXISTS public.cms_written_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    country TEXT NOT NULL,
    platform_purchased TEXT NOT NULL,
    rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    avatar TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    show_on_homepage BOOLEAN NOT NULL DEFAULT true,
    show_on_marketplace BOOLEAN NOT NULL DEFAULT true,
    show_on_community BOOLEAN NOT NULL DEFAULT true,
    show_on_about BOOLEAN NOT NULL DEFAULT true,
    show_on_seller_profile BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cms_video_testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_url TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    country TEXT NOT NULL,
    rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
    summary TEXT NOT NULL,
    duration TEXT NOT NULL CHECK (duration IN ('30s', '45s', '1m', '2m')),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    show_on_homepage BOOLEAN NOT NULL DEFAULT true,
    show_on_marketplace BOOLEAN NOT NULL DEFAULT true,
    show_on_community BOOLEAN NOT NULL DEFAULT true,
    show_on_about BOOLEAN NOT NULL DEFAULT true,
    show_on_seller_profile BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Triggers for updated_at
DROP TRIGGER IF EXISTS trigger_set_cms_written_reviews_updated_at ON public.cms_written_reviews;
CREATE TRIGGER trigger_set_cms_written_reviews_updated_at
BEFORE UPDATE ON public.cms_written_reviews
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trigger_set_cms_video_testimonials_updated_at ON public.cms_video_testimonials;
CREATE TRIGGER trigger_set_cms_video_testimonials_updated_at
BEFORE UPDATE ON public.cms_video_testimonials
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS
ALTER TABLE public.cms_written_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_video_testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cms_written_reviews
CREATE POLICY "Public can view cms_written_reviews" ON public.cms_written_reviews
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert cms_written_reviews" ON public.cms_written_reviews
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update cms_written_reviews" ON public.cms_written_reviews
    FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete cms_written_reviews" ON public.cms_written_reviews
    FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for cms_video_testimonials
CREATE POLICY "Public can view cms_video_testimonials" ON public.cms_video_testimonials
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert cms_video_testimonials" ON public.cms_video_testimonials
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update cms_video_testimonials" ON public.cms_video_testimonials
    FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete cms_video_testimonials" ON public.cms_video_testimonials
    FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
