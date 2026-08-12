-- Ensure buckets exist (ON CONFLICT DO NOTHING)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('testimonials-videos', 'testimonials-videos', true, 52428800, ARRAY['video/mp4', 'video/quicktime', 'video/webm']),
  ('testimonials-thumbnails', 'testimonials-thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policies for storage buckets
-- Public can read
CREATE POLICY "Public testimonials videos read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'testimonials-videos');
  
CREATE POLICY "Public testimonials thumbnails read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'testimonials-thumbnails');

-- Admins can insert, update, delete
-- Assuming an `is_admin()` function or similar exists. We'll use auth.uid() and a subquery to profiles.
-- The prompt says "The admin check must use the authenticated Supabase session and the application's existing profile role system."
CREATE POLICY "Admin testimonials videos all" ON storage.objects
  FOR ALL TO authenticated USING (
    bucket_id = 'testimonials-videos' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  ) WITH CHECK (
    bucket_id = 'testimonials-videos' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin testimonials thumbnails all" ON storage.objects
  FOR ALL TO authenticated USING (
    bucket_id = 'testimonials-thumbnails' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  ) WITH CHECK (
    bucket_id = 'testimonials-thumbnails' AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for cms_written_reviews
ALTER TABLE cms_written_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read written reviews" ON cms_written_reviews;
CREATE POLICY "Public can read written reviews" ON cms_written_reviews
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can manage written reviews" ON cms_written_reviews;
CREATE POLICY "Admins can manage written reviews" ON cms_written_reviews
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for cms_video_testimonials
ALTER TABLE cms_video_testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read video testimonials" ON cms_video_testimonials;
CREATE POLICY "Public can read video testimonials" ON cms_video_testimonials
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can manage video testimonials" ON cms_video_testimonials;
CREATE POLICY "Admins can manage video testimonials" ON cms_video_testimonials
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
