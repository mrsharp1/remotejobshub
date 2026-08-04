-- SQL Migration 006: Add dynamic CMS Tables to support live Careers, Events, and Timeline Milestones

CREATE TABLE IF NOT EXISTS cms_careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    requirements TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TEXT NOT NULL,
    event_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_timeline_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and add basic security policies
ALTER TABLE cms_careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_timeline_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to careers" ON cms_careers FOR SELECT USING (true);
CREATE POLICY "Allow public read access to events" ON cms_events FOR SELECT USING (true);
CREATE POLICY "Allow public read access to milestones" ON cms_timeline_milestones FOR SELECT USING (true);

-- Allow admin full control (assuming profile roles are configured correctly)
CREATE POLICY "Allow admin all access to careers" ON cms_careers FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Allow admin all access to events" ON cms_events FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Allow admin all access to milestones" ON cms_timeline_milestones FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
