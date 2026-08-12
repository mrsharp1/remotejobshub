-- Migration: 20260808000001_create_listings_bucket.sql
-- Description: Create the `listings` bucket for storing public marketplace listing images and apply appropriate RLS policies.

-- 1. Create the `listings` bucket if it doesn't exist.
-- It must be public to allow marketplace rendering of uploaded images.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listings',
  'listings',
  true,
  10485760, -- 10 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 2. (RLS is already enabled on storage.objects by default)

-- 3. Drop existing policies to prevent conflicts if re-run
DROP POLICY IF EXISTS "Public access to listing images" ON storage.objects;
DROP POLICY IF EXISTS "Sellers can upload listing images to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Sellers can update their own listing images" ON storage.objects;
DROP POLICY IF EXISTS "Sellers can delete their own listing images" ON storage.objects;

-- 4. Create RLS Policies

-- SELECT: Anyone can view public listing images
CREATE POLICY "Public access to listing images"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'listings' );

-- INSERT: Authenticated users can upload, but ONLY into a folder named after their own UID
-- Expected path structure: sellers/{uid}/listings-drafts/{filename} or sellers/{uid}/listings/{listing_id}/{filename}
CREATE POLICY "Sellers can upload listing images to their own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listings' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'sellers'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- UPDATE: Authenticated users can modify their own images
CREATE POLICY "Sellers can update their own listing images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'listings' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'sellers'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

-- DELETE: Authenticated users can delete their own images
CREATE POLICY "Sellers can delete their own listing images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'listings' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'sellers'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );
