# Settings Module Setup Guide

Complete guide for the QodeBench Settings Module implementation.

## Overview

The Settings Module provides users with the ability to manage their profile information and account settings. It includes:

- **Profile Settings**: Edit username, full name, bio, and avatar
- **Account Settings**: Change email, password, and delete account
- **Avatar Upload**: Upload, preview, and remove profile pictures

## Files Created

### Server Actions
- `app/actions/settings.ts` - All server-side operations for settings

### Components
- `components/settings/settings-client.tsx` - Main client wrapper with tabs
- `components/settings/profile-settings-form.tsx` - Profile editing form
- `components/settings/account-settings-form.tsx` - Account management form
- `components/settings/avatar-upload.tsx` - Avatar upload component with drag & drop
- `components/settings/delete-account-dialog.tsx` - Account deletion confirmation dialog

### Page
- `app/dashboard/settings/page.tsx` - Settings page (Server Component)

### Database Migration
- `supabase/migrations/003_create_avatars_bucket.sql` - Storage bucket setup

## Setup Instructions

### 1. Create Avatars Storage Bucket

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to your Supabase Dashboard
2. Navigate to **Storage** section
3. Click **Create a new bucket**
4. Set the following:
   - Name: `avatars`
   - Public: ✅ Yes
   - File size limit: `5242880` (5MB)
   - Allowed MIME types: `image/jpeg, image/png, image/jpg`
5. Click **Create bucket**

**Option B: Via SQL**

Run the migration file in Supabase SQL Editor:
```bash
# Copy the contents of supabase/migrations/003_create_avatars_bucket.sql
# and execute in Supabase Dashboard > SQL Editor
```

### 2. Set Storage Policies

After creating the bucket, add the following RLS policies:

1. Go to **Storage** > **Policies** > **avatars** bucket
2. Add the following policies (or run the SQL from the migration):

```sql
-- Users can upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Public read access
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');
```

### 3. Verify Setup

Run this query in SQL Editor to verify:

```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE id = 'avatars';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%avatar%';
```

### 4. Test the Module

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/dashboard/settings` in your browser

3. Test the following:
   - ✅ Edit username (with uniqueness check)
   - ✅ Edit full name and bio
   - ✅ Upload avatar image (drag & drop or click)
   - ✅ Remove avatar
   - ✅ Change email (verification email sent)
   - ✅ Change password
   - ✅ Delete account (with confirmation)

## Features

### Profile Settings

**Username**
- Real-time availability checking (debounced)
- Uniqueness validation
- Format validation (alphanumeric + underscore only)
- 3-20 characters

**Full Name**
- Optional field
- Max 100 characters

**Bio**
- Optional field
- Max 500 characters
- Character counter

**Avatar**
- Drag & drop or click to upload
- File type validation (JPEG, PNG)
- File size validation (max 5MB)
- Preview before upload
- Remove avatar option
- Automatic cleanup of old avatars

### Account Settings

**Email Change**
- Email validation
- Sends verification email
- Requires email confirmation

**Password Change**
- Requires current password
- Password strength validation
  - Min 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- Confirm password matching

**Delete Account**
- Double confirmation required
- Must type username to confirm
- Warning about data loss
- Deletes profile and signs out user
- Removes avatar from storage

## Security Features

### Row Level Security (RLS)
- All mutations validate user authentication
- Users can only modify their own data
- Avatar storage policies enforce user ownership

### Validation
- Server-side Zod validation
- Client-side form validation
- Username uniqueness check
- File type and size validation

### Authentication
- Email change requires verification
- Password change requires current password
- Account deletion requires username confirmation

## UI/UX Features

### Loading States
- Skeleton loaders for initial page load
- Button loading states during operations
- Avatar upload progress indicator

### Feedback
- Success toast notifications
- Error toast notifications with details
- Real-time validation feedback
- Username availability indicator

### Forms
- Unsaved changes detection
- Form reset on cancel
- Disabled submit until changes made
- Field-level error messages

### Responsive Design
- Mobile-friendly layouts
- Touch-friendly buttons
- Responsive form fields
- Adaptive spacing

## Architecture

### Server Components
- Settings page (`page.tsx`) - Fetches initial data
- Suspense boundaries for loading states

### Client Components
- Form components with React Hook Form
- Real-time validation with Zod
- Interactive UI elements

### Server Actions
- All mutations as server actions
- Automatic revalidation
- Type-safe operations

### State Management
- Form state via React Hook Form
- Local state for UI interactions
- Router refresh after updates

## API Reference

### Server Actions

All actions are located in `app/actions/settings.ts`:

```typescript
// Get current user profile
getCurrentUserProfile(): Promise<Result<Profile>>

// Check username availability
checkUsernameAvailability(username: string): Promise<Result<boolean>>

// Update profile
updateProfile(data: ProfileData): Promise<Result>

// Upload avatar
uploadAvatar(formData: FormData): Promise<Result<{ avatar_url: string }>>

// Remove avatar
removeAvatar(): Promise<Result>

// Update email
updateEmail(data: { email: string }): Promise<Result>

// Update password
updatePassword(data: PasswordData): Promise<Result>

// Delete account
deleteAccount(confirmation: string): Promise<Result>
```

## Troubleshooting

### Issue: "Bucket does not exist"
**Fix**: Create the `avatars` bucket in Supabase Dashboard Storage section

### Issue: "Permission denied for storage"
**Fix**: Check that storage policies are correctly set up

### Issue: "Username already taken" but username is available
**Fix**: Check database for duplicate usernames, ensure RLS policies are correct

### Issue: Avatar not uploading
**Fix**:
1. Verify bucket exists and is public
2. Check file size < 5MB
3. Check file type is JPEG or PNG
4. Verify storage policies allow uploads

### Issue: Email change not working
**Fix**:
1. Check Supabase email settings are configured
2. Verify email templates are set up
3. Check spam folder for verification email

### Issue: Password change fails with "incorrect password"
**Fix**: Ensure current password is correct, password may have been changed elsewhere

## Next Steps

### Optional Enhancements

1. **Profile Visibility Settings**
   - Toggle public/private profile
   - Control what data is shown on leaderboard

2. **Notification Preferences**
   - Email notification settings
   - Weekly digest preferences
   - Achievement alerts

3. **Theme Customization**
   - Light/Dark mode toggle
   - System preference detection

4. **Two-Factor Authentication**
   - Enable 2FA for account security
   - Backup codes generation

5. **Connected Accounts**
   - Link GitHub, Google, etc.
   - Social profile connections

6. **Data Export**
   - Download all user data
   - GDPR compliance

## Deployment Checklist

- [ ] Create `avatars` storage bucket in production Supabase
- [ ] Set up storage policies for avatars bucket
- [ ] Verify email settings for password/email changes
- [ ] Test avatar upload in production
- [ ] Test all settings features end-to-end
- [ ] Monitor error logs for issues

## Support

For issues or questions:
1. Check Supabase Dashboard logs
2. Verify storage bucket configuration
3. Check browser console for errors
4. Review server action responses

---

**Created**: 2025-01-XX
**Version**: 1.0.0
**Author**: QodeBench Team
