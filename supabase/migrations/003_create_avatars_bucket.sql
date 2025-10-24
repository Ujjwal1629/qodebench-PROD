-- =====================================================
-- SUPABASE STORAGE: AVATARS BUCKET SETUP
-- =====================================================
-- This migration creates the avatars storage bucket for user profile pictures
-- Run this in Supabase SQL Editor or via Supabase CLI

-- =====================================================
-- 1. CREATE AVATARS BUCKET
-- =====================================================
-- Note: This should ideally be done via Supabase Dashboard Storage UI
-- or programmatically, but this provides the reference configuration

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Public bucket for public avatar access
  5242880, -- 5MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. STORAGE POLICIES
-- =====================================================

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own avatars
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to all avatars (since profiles are public)
CREATE POLICY "Public avatar access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check that bucket was created
SELECT * FROM storage.buckets WHERE id = 'avatars';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%avatar%';

-- =====================================================
-- USAGE NOTES
-- =====================================================

-- File path structure: {user_id}/avatar.{ext}
-- Example: 123e4567-e89b-12d3-a456-426614174000/avatar.jpg

-- Public URL format:
-- https://{project-ref}.supabase.co/storage/v1/object/public/avatars/{user_id}/avatar.jpg

-- To delete old avatar before uploading new one:
-- await supabase.storage.from('avatars').remove([`${user_id}/avatar.jpg`]);

-- To upload new avatar:
-- await supabase.storage.from('avatars').upload(`${user_id}/avatar.jpg`, file, { upsert: true });
