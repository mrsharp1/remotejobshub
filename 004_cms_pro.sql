-- 004_cms_pro.sql
-- Enterprise CMS Extension

-- 1. CMS Revisions (Version History)
CREATE TABLE cms_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL, -- 'page', 'section', 'faq', 'policy'
    entity_id UUID NOT NULL,
    snapshot JSONB NOT NULL,
    restored_from UUID REFERENCES cms_revisions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_by UUID REFERENCES profiles(id)
);

-- 2. CMS Policies (Terms, Privacy, etc.)
CREATE TABLE cms_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- Rich Text HTML or Markdown
    status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
    version TEXT NOT NULL DEFAULT '1.0',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    author_id UUID REFERENCES profiles(id)
);

-- 3. CMS Testimonials
CREATE TABLE cms_testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_name TEXT NOT NULL,
    author_role TEXT,
    author_avatar_url TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    video_url TEXT,
    is_verified_buyer BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. CMS Success Stories
CREATE TABLE cms_success_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL, -- Rich Text
    featured_image_url TEXT,
    video_url TEXT,
    seller_name TEXT NOT NULL,
    country TEXT,
    income_generated NUMERIC,
    timeline_months INTEGER,
    tags TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Homepage Statistics
CREATE TABLE homepage_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    manual_value TEXT,
    auto_metric_key TEXT, -- 'total_users', 'total_volume', 'active_listings'
    mode TEXT DEFAULT 'manual', -- 'manual', 'auto'
    icon_name TEXT,
    sort_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Alter Navigation Links for Nested & Rules
ALTER TABLE navigation_links ADD COLUMN parent_id UUID REFERENCES navigation_links(id) ON DELETE CASCADE;
ALTER TABLE navigation_links ADD COLUMN visibility_rules JSONB DEFAULT '{"guest": true, "logged_in": true, "buyer": true, "seller": true, "admin": true}'::jsonb;
ALTER TABLE navigation_links ADD COLUMN icon_name TEXT;

-- 7. Alter Homepage Sections for Scheduling & Duplication
ALTER TABLE homepage_sections ADD COLUMN status TEXT DEFAULT 'published';
ALTER TABLE homepage_sections ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE homepage_sections DROP CONSTRAINT IF EXISTS homepage_sections_section_key_key; -- Allow duplication, key might just be type now
ALTER TABLE homepage_sections ADD COLUMN custom_id TEXT UNIQUE; -- To retain unique identification if needed

-- Enable RLS
ALTER TABLE cms_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_stats ENABLE ROW LEVEL SECURITY;

-- Public Access Policies
CREATE POLICY "Public can view published policies" ON cms_policies FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published testimonials" ON cms_testimonials FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published success stories" ON cms_success_stories FOR SELECT USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));
CREATE POLICY "Public can view visible stats" ON homepage_stats FOR SELECT USING (is_visible = true);

-- Admin Full Access Policies
CREATE POLICY "Admins have full access to cms_revisions" ON cms_revisions FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins have full access to cms_policies" ON cms_policies FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins have full access to cms_testimonials" ON cms_testimonials FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins have full access to cms_success_stories" ON cms_success_stories FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins have full access to homepage_stats" ON homepage_stats FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
