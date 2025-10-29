-- Add onboarding quiz fields to profiles table
-- Migration: 009_add_onboarding_fields

-- Add new columns for onboarding quiz tracking
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS quiz_score INTEGER CHECK (quiz_score >= 0 AND quiz_score <= 100),
ADD COLUMN IF NOT EXISTS quiz_completed_at TIMESTAMP WITH TIME ZONE;

-- Add index for onboarding_completed for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON profiles(onboarding_completed);

-- Add comment
COMMENT ON COLUMN profiles.onboarding_completed IS 'Indicates if user has completed the onboarding quiz';
COMMENT ON COLUMN profiles.quiz_score IS 'User score on onboarding quiz (0-100)';
COMMENT ON COLUMN profiles.quiz_completed_at IS 'Timestamp when user completed the onboarding quiz';
