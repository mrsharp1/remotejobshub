-- Migration: Create Video Guide Feature
-- Description: Creates the public.video_guides table and video-guides storage bucket.

-- 1. Create the video_guides table
CREATE TABLE IF NOT EXISTS public.video_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    storage_path TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_set_video_guides_updated_at ON public.video_guides;
CREATE TRIGGER trigger_set_video_guides_updated_at
BEFORE UPDATE ON public.video_guides
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS on video_guides
ALTER TABLE public.video_guides ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_guides
-- Public can read ONLY published guides
CREATE POLICY "Public can view published video_guides" ON public.video_guides
    FOR SELECT TO public
    USING (is_published = true);

-- Admins can read all guides (including drafts)
CREATE POLICY "Admins can view all video_guides" ON public.video_guides
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admins can insert, update, delete
CREATE POLICY "Admins can insert video_guides" ON public.video_guides
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update video_guides" ON public.video_guides
    FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete video_guides" ON public.video_guides
    FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 2. Create the video-guides Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'video-guides', 
  'video-guides', 
  true, 
  104857600, -- 100MB
  ARRAY['video/mp4', 'video/quicktime', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policies for the video-guides bucket
-- Note: 'video-guides' is public so it relies on storage.objects policies

-- Public can read objects in the video-guides bucket
CREATE POLICY "Public video guides read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'video-guides');

-- Admins have full access to objects in the video-guides bucket
CREATE POLICY "Admin video guides all" ON storage.objects
  FOR ALL TO authenticated USING (
    bucket_id = 'video-guides' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  ) WITH CHECK (
    bucket_id = 'video-guides' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
