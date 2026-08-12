-- Migration: 20260808000002_add_admin_listing_policy.sql
-- Description: Add missing RLS policies to allow admins to manage all listings, including pending verifications.

-- SELECT: Admins can view all listings
CREATE POLICY "Admins can select all listings" ON public.listings
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- UPDATE: Admins can update all listings (needed for approval/rejection)
CREATE POLICY "Admins can update all listings" ON public.listings
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- DELETE: Admins can delete all listings (needed for moderation)
CREATE POLICY "Admins can delete all listings" ON public.listings
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
