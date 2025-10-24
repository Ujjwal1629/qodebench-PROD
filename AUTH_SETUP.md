# QodeBench Authentication Setup Guide

## Overview

A complete authentication system has been implemented with Supabase, featuring:

- ✅ Email/Password authentication
- ✅ OAuth (Google & GitHub)
- ✅ User profiles with username and experience level
- ✅ Password reset functionality
- ✅ Form validation with react-hook-form + zod
- ✅ Password strength indicator
- ✅ Real-time username availability checking
- ✅ Protected routes with middleware

## Database Setup

### Step 1: Run the Migration

You need to run the SQL migration to create the `user_profiles` table in your Supabase database.

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_create_user_profiles.sql`
4. Paste and run the SQL

**Option B: Using Supabase CLI** (if you have it set up)
```bash
supabase db push
```

### Step 2: Verify the Migration

The migration creates:
- `user_profiles` table with columns:
  - `id` (UUID, references auth.users)
  - `username` (TEXT, unique, 3-20 characters, alphanumeric + underscore)
  - `experience_level` (ENUM: Intern, Junior, Mid-Level, Senior)
  - `created_at` and `updated_at` timestamps
- Row Level Security (RLS) policies
- Database indexes for performance
- Triggers for automatic timestamp updates

## OAuth Setup

### Google OAuth

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Enable **Google** provider
4. Follow Supabase's instructions to:
   - Create a Google Cloud Project
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs from Supabase

### GitHub OAuth

1. In Supabase dashboard, navigate to **Authentication** > **Providers**
2. Enable **GitHub** provider
3. Follow Supabase's instructions to:
   - Create a GitHub OAuth App
   - Add authorized redirect URIs from Supabase
   - Configure the Client ID and Secret in Supabase

### Auth Callback Route

Create an auth callback route to handle OAuth redirects:

**File: `app/auth/callback/route.ts`**
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to signin if something went wrong
  return NextResponse.redirect(`${origin}/signin`);
}
```

## File Structure

```
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx           # Auth pages layout (already exists)
│   │   ├── signin/page.tsx      # Sign in page (already exists)
│   │   ├── signup/page.tsx      # Sign up page (already exists)
│   │   └── reset-password/page.tsx  # New: Password reset page
│   └── auth/
│       └── callback/route.ts    # OAuth callback handler (needs to be created)
│
├── components/
│   ├── auth/
│   │   ├── signin-form.tsx      # Enhanced: react-hook-form + zod + OAuth
│   │   ├── signup-form.tsx      # Enhanced: username + experience + password strength
│   │   ├── reset-password-form.tsx  # New: Password reset form
│   │   ├── oauth-buttons.tsx    # New: Google & GitHub OAuth buttons
│   │   └── password-strength-indicator.tsx  # New: Password strength meter
│   └── ui/
│       ├── select.tsx           # New: shadcn select component
│       └── progress.tsx         # New: shadcn progress component
│
├── lib/
│   ├── auth/
│   │   └── index.ts             # New: Auth utilities and helpers
│   └── supabase/
│       ├── client.ts            # Browser client (already exists)
│       ├── server.ts            # Server client (already exists)
│       └── middleware.ts        # Auth middleware (already exists)
│
├── hooks/
│   └── use-auth.ts              # Enhanced: Added OAuth, reset password, profile creation
│
├── types/
│   └── supabase.ts              # Enhanced: Added user_profiles table types
│
└── supabase/
    └── migrations/
        └── 001_create_user_profiles.sql  # New: Database schema migration
```

## Features

### Sign In Page (`/signin`)
- Email and password fields with validation
- OAuth buttons (Google & GitHub)
- "Forgot password?" link
- Link to sign up page
- Form validation with error messages

### Sign Up Page (`/signup`)
- Username field (3-20 chars, unique, real-time availability check)
- Email field with validation
- Experience level dropdown (Intern/Junior/Mid-Level/Senior)
- Password field with strength indicator
- Confirm password field
- OAuth buttons
- Link to sign in page
- Comprehensive form validation

### Reset Password Page (`/reset-password`)
- Email input to request password reset
- Success message after sending reset link
- Link back to sign in
- Form validation

### Protected Routes
- All routes except `/`, `/signin`, `/signup`, and `/reset-password` require authentication
- Unauthenticated users are redirected to `/signin`
- Authenticated users trying to access auth pages are redirected to `/dashboard`

## Usage Examples

### Sign Up with Username and Experience Level

```typescript
// The signup form automatically handles this
await signUp(
  'user@example.com',
  'securePassword123',
  'johndoe',           // username
  'Mid-Level'          // experience level
);
```

### Check Username Availability

```typescript
import { checkUsernameAvailability } from '@/lib/auth';

const isAvailable = await checkUsernameAvailability('johndoe');
// Returns true if available, false if taken
```

### Get User Profile

```typescript
import { getUserProfile } from '@/lib/auth';

const profile = await getUserProfile(userId);
// Returns { id, username, experience_level, created_at, updated_at }
```

### Password Strength Validation

```typescript
import { calculatePasswordStrength } from '@/lib/auth';

const strength = calculatePasswordStrength('MyP@ssw0rd');
// Returns: { score: 85, level: 'strong', feedback: [] }
```

## Testing

1. **Start the dev server**: The server should already be running on http://localhost:3002
2. **Test Sign Up**:
   - Visit http://localhost:3002/signup
   - Fill in all fields including username and experience level
   - Watch the password strength indicator update
   - Submit to create an account
3. **Test Sign In**:
   - Visit http://localhost:3002/signin
   - Sign in with created credentials
   - Should redirect to /dashboard
4. **Test Password Reset**:
   - Visit http://localhost:3002/reset-password
   - Enter email and submit
   - Check email for reset link
5. **Test OAuth** (after setup):
   - Click "Continue with Google" or "Continue with GitHub"
   - Complete OAuth flow
   - Should redirect to /dashboard

## Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Next Steps

1. **Run the database migration** (see Database Setup above)
2. **Configure OAuth providers** in Supabase (see OAuth Setup above)
3. **Create the auth callback route** (see OAuth Setup > Auth Callback Route)
4. **Test the authentication flow**
5. **Customize the styling** if needed (all forms use QodeBench brand color #3B82F6)

## Troubleshooting

### Username Already Taken
- The form checks username availability on blur
- If taken, an error message will appear
- Try a different username

### OAuth Not Working
- Ensure OAuth providers are configured in Supabase
- Check that the callback URL is correct
- Verify environment variables are set

### Password Reset Email Not Received
- Check spam folder
- Verify email configuration in Supabase
- Ensure SMTP is configured if using custom email

### TypeScript Errors
- Run `npm run build` to check for type errors
- Ensure all dependencies are installed: `npm install`

## Security Features

- ✅ Row Level Security (RLS) enabled on user_profiles table
- ✅ Users can only read their own profile and update their own data
- ✅ Username format validation (alphanumeric + underscore)
- ✅ Password minimum length requirement (8 characters)
- ✅ Email validation
- ✅ CSRF protection via Supabase
- ✅ Secure password storage (handled by Supabase)
- ✅ Protected routes with middleware

---

**Need Help?** Check the CLAUDE.md file for additional guidance or refer to the [Supabase Documentation](https://supabase.com/docs).
