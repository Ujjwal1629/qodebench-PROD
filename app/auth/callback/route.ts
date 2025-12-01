import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { rateLimiter, getRateLimitIdentifier } from '@/lib/utils/rate-limiter';
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  // Rate limit OAuth callbacks to prevent abuse
  const identifier = getRateLimitIdentifier(null, request);
  const rateLimit = rateLimiter.checkAndRespond(identifier, 'authCallback');
  if (rateLimit) {
    logger.security('Auth callback rate limited', { identifier, action: 'rate_limited' });
    return rateLimit.response;
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/dashboard';

  // Handle OAuth errors (e.g., multiple accounts with same email)
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    logger.security('OAuth callback error', { error, errorDescription });

    // Redirect to signin with error message
    const signinUrl = new URL('/signin', origin);

    // Handle specific error: multiple accounts with same email
    if (error === 'server_error' && errorDescription?.includes('Multiple accounts')) {
      signinUrl.searchParams.set('error', 'account_exists');
      signinUrl.searchParams.set('message', 'An account with this email already exists. Please sign in with your original method (email/password or another provider).');
    } else {
      signinUrl.searchParams.set('error', 'auth_failed');
      signinUrl.searchParams.set('message', 'Authentication failed. Please try again or use a different sign-in method.');
    }

    return NextResponse.redirect(signinUrl);
  }

  if (code) {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Create response first
    const redirectUrl = new URL(next, origin);
    const response = NextResponse.redirect(redirectUrl);

    // Create Supabase client with proper cookie handling for route handlers
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            // Set cookies on both the cookie store and the response
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // If this is a password recovery, redirect to update password page
      if (type === 'recovery') {
        const recoveryUrl = new URL('/update-password', origin);
        const recoveryResponse = NextResponse.redirect(recoveryUrl);

        // Copy cookies to recovery response
        response.cookies.getAll().forEach(cookie => {
          recoveryResponse.cookies.set(cookie);
        });

        return recoveryResponse;
      }

      // Google OAuth provides 'picture', GitHub provides 'avatar_url'
      const avatarUrl = data.user.user_metadata?.avatar_url ||
                        data.user.user_metadata?.picture ||
                        null;

      // Wait a moment for the database trigger to create the profile
      // (The handle_new_user trigger runs on auth.users INSERT)
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if user profile exists (should exist from trigger)
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, avatar_url, onboarding_completed, username')
        .eq('id', data.user.id)
        .single();

      // If profile doesn't exist after trigger, create one manually
      if (!profile) {
        // Generate unique username
        const baseUsername = data.user.user_metadata?.full_name?.toLowerCase().replace(/\s+/g, '_') ||
                            data.user.user_metadata?.preferred_username?.toLowerCase() ||
                            data.user.email?.split('@')[0] ||
                            `user_${data.user.id.slice(0, 8)}`;

        // Add random suffix to ensure uniqueness
        const username = `${baseUsername}_${Math.random().toString(36).substring(2, 6)}`;

        const { error: insertError } = await supabase.from('profiles').insert({
          id: data.user.id,
          username: username,
          full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
          avatar_url: avatarUrl,
        });

        if (insertError) {
          console.error('Error creating profile:', insertError);
          // Continue anyway - middleware will catch this
        }

        // Fetch the profile again
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('id, avatar_url, onboarding_completed, username')
          .eq('id', data.user.id)
          .single();

        profile = newProfile;
      } else if (avatarUrl && !profile.avatar_url) {
        // Update existing profile if it doesn't have an avatar
        await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('id', data.user.id);
      }

      // Check if user needs to complete onboarding quiz
      if (!profile || !profile.onboarding_completed) {
        const quizUrl = new URL('/onboarding/quiz', origin);
        const quizResponse = NextResponse.redirect(quizUrl);

        // Copy cookies to quiz response
        response.cookies.getAll().forEach(cookie => {
          quizResponse.cookies.set(cookie);
        });

        return quizResponse;
      }

      // Return response with cookies properly set
      return response;
    }
  }

  // Return to signin if something went wrong
  const redirectUrl = new URL('/signin', origin);
  return NextResponse.redirect(redirectUrl);
}
