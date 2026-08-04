-- 005_cms_final.sql
-- Enterprise CMS Finalization

-- 1. CMS Audit Log
CREATE TABLE cms_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_table TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'MODERATE'
    previous_value JSONB,
    new_value JSONB,
    user_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. CMS Blocks (Reusable Block Blueprints)
CREATE TABLE cms_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL UNIQUE, -- 'hero', 'text', 'gallery', 'video', 'faq', 'cta'
    schema JSONB NOT NULL, -- Defines what fields this block expects
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. CMS Page Blocks (Instances of blocks on a specific page/section)
CREATE TABLE cms_page_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID, -- References cms_pages or a specific section
    block_type TEXT REFERENCES cms_blocks(type),
    data JSONB NOT NULL, -- The actual content matching the schema
    sort_order INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Media Folders & Extensions
CREATE TABLE cms_media_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    parent_id UUID REFERENCES cms_media_folders(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE cms_media ADD COLUMN folder_id UUID REFERENCES cms_media_folders(id) ON DELETE SET NULL;
ALTER TABLE cms_media ADD COLUMN tags TEXT[];
ALTER TABLE cms_media ADD COLUMN is_unused BOOLEAN DEFAULT FALSE;
ALTER TABLE cms_media ADD COLUMN optimization_status TEXT DEFAULT 'pending'; -- 'pending', 'optimized', 'failed'

-- 5. Extend Testimonials and Success Stories for full Moderation
-- Using ALTER TABLE to strictly enforce CHECK constraints if necessary, or just rely on application logic.
-- Ensure these tables exist from 004_cms_pro.sql and are compatible with 'pending', 'approved', 'rejected', etc.

-- Enable RLS
ALTER TABLE cms_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media_folders ENABLE ROW LEVEL SECURITY;

-- Admin Full Access Policies
CREATE POLICY "Admins have full access to cms_audit_log" ON cms_audit_log FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins have full access to cms_blocks" ON cms_blocks FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins have full access to cms_page_blocks" ON cms_page_blocks FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins have full access to cms_media_folders" ON cms_media_folders FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Public Read Policies for Page Blocks
CREATE POLICY "Public can view page blocks" ON cms_page_blocks FOR SELECT USING (is_hidden = false);

-- Insert Default Blocks
INSERT INTO cms_blocks (type, schema, description) VALUES
('hero', '{"type":"object","properties":{"headline":{"type":"string"},"subheadline":{"type":"string"}}}', 'Standard Hero Block'),
('text', '{"type":"object","properties":{"content":{"type":"string"}}}', 'Rich Text Block'),
('gallery', '{"type":"object","properties":{"images":{"type":"array"}}}', 'Image Gallery Block'),
('cta', '{"type":"object","properties":{"buttonText":{"type":"string"},"url":{"type":"string"}}}', 'Call to Action Block')
ON CONFLICT (type) DO NOTHING;
