-- 003_cms_system.sql
-- Core CMS schema for dynamic content management

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Settings
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name TEXT NOT NULL DEFAULT 'Remote Jobs Hub',
    site_description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    maintenance_message TEXT,
    support_email TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES profiles(id)
);

-- Ensure only one site_settings row exists
CREATE UNIQUE INDEX site_settings_single_row ON site_settings((1));

-- 2. SEO Settings
CREATE TABLE seo_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path TEXT UNIQUE NOT NULL, -- e.g., '/', '/marketplace'
    meta_title TEXT NOT NULL,
    meta_description TEXT,
    keywords TEXT,
    og_image_url TEXT,
    canonical_url TEXT,
    structured_data JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES profiles(id)
);

-- 3. CMS Pages
CREATE TABLE cms_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    author_id UUID REFERENCES profiles(id)
);

-- 4. CMS Sections (Reusable content blocks)
CREATE TABLE cms_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES cms_pages(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL, -- 'hero', 'features', 'testimonials', 'rich_text', etc.
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    content JSONB NOT NULL DEFAULT '{}'::jsonb, -- Flexible schema per section type
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Homepage Sections Configuration (Order & Visibility)
CREATE TABLE homepage_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key TEXT UNIQUE NOT NULL, -- 'hero', 'stats', 'trusted_by', 'featured_listings', 'features'
    display_name TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    config JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Navigation & Footer Links
CREATE TABLE navigation_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_location TEXT NOT NULL, -- 'header_main', 'footer_company', 'footer_legal', etc.
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    is_external BOOLEAN DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Social Links
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL, -- 'twitter', 'linkedin', 'github', etc.
    url TEXT NOT NULL,
    icon_name TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. FAQ Management
CREATE TABLE cms_faq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL DEFAULT 'General',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. Announcements
CREATE TABLE cms_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'info', 'warning', 'success', 'promo'
    link_url TEXT,
    link_text TEXT,
    is_dismissible BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT FALSE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_by UUID REFERENCES profiles(id)
);

-- 10. CMS Media Library
CREATE TABLE cms_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL, -- 'image/jpeg', 'video/mp4', etc.
    file_size INTEGER,
    alt_text TEXT,
    folder TEXT DEFAULT 'general',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    uploaded_by UUID REFERENCES profiles(id)
);

-- Row Level Security (RLS)

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies
CREATE POLICY "Public can view site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view seo_settings" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Public can view published pages" ON cms_pages FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view visible sections" ON cms_sections FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view homepage_sections" ON homepage_sections FOR SELECT USING (is_enabled = true);
CREATE POLICY "Public can view navigation_links" ON navigation_links FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view social_links" ON social_links FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can view published faq" ON cms_faq FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view active announcements" ON cms_announcements FOR SELECT USING (
    is_active = true 
    AND (start_date IS NULL OR start_date <= now())
    AND (end_date IS NULL OR end_date >= now())
);
CREATE POLICY "Public can view media" ON cms_media FOR SELECT USING (true);

-- Admin Full Access Policies
-- Note: Assuming admin role is checked via profile role or auth.jwt()
CREATE POLICY "Admins have full access to site_settings" ON site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access to seo_settings" ON seo_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access to cms_pages" ON cms_pages FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access to cms_sections" ON cms_sections FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access to homepage_sections" ON homepage_sections FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access to navigation_links" ON navigation_links FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access to social_links" ON social_links FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access to cms_faq" ON cms_faq FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access to cms_announcements" ON cms_announcements FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins have full access to cms_media" ON cms_media FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Seed Initial Homepage Sections
INSERT INTO homepage_sections (section_key, display_name, sort_order) VALUES
('hero', 'Hero Section', 10),
('trusted_by', 'Trusted By Logos', 20),
('stats', 'Platform Statistics', 30),
('features', 'Security & Features', 40),
('featured_listings', 'Featured Accounts', 50),
('similar_listings', 'AI Similar Picks', 60),
('testimonials', 'User Testimonials', 70),
('faq', 'Frequently Asked Questions', 80),
('cta', 'Call to Action Bottom', 90)
ON CONFLICT (section_key) DO NOTHING;

-- Seed Initial Site Settings
INSERT INTO site_settings (site_name, site_description) VALUES
('Remote Jobs Hub', 'Buy & Sell Verified Remote Work Accounts')
ON CONFLICT DO NOTHING;
