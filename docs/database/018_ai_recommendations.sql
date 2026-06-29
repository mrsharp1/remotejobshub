-- 018_ai_recommendations.sql
-- Migration establishing schemas for marketplace listing views tracking, saved searches, and recommendation outputs

-- 1. Create Listing Views Table
CREATE TABLE IF NOT EXISTS public.listing_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Saved Searches Table
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create AI Recommendations Table
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recommended_listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  reason TEXT,
  score NUMERIC CHECK (score >= 0 AND score <= 1),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.listing_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Grant Select permissions
DROP POLICY IF EXISTS "Select own listing views" ON public.listing_views;
CREATE POLICY "Select own listing views" ON public.listing_views
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Insert own listing views" ON public.listing_views;
CREATE POLICY "Insert own listing views" ON public.listing_views
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Select own saved searches" ON public.saved_searches;
CREATE POLICY "Select own saved searches" ON public.saved_searches
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Insert own saved searches" ON public.saved_searches;
CREATE POLICY "Insert own saved searches" ON public.saved_searches
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Delete own saved searches" ON public.saved_searches;
CREATE POLICY "Delete own saved searches" ON public.saved_searches
  FOR DELETE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Select own recommendations" ON public.ai_recommendations;
CREATE POLICY "Select own recommendations" ON public.ai_recommendations
  FOR SELECT USING (user_id = auth.uid());
