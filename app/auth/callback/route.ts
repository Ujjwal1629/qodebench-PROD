import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/dashboard';

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

      // Google OAuth provides 'picture' or 'avatar_url'
      const avatarUrl = data.user.user_metadata?.avatar_url ||
                        data.user.user_metadata?.picture ||
                        null;

      // Check if user profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, avatar_url')
        .eq('id', data.user.id)
        .single();

      // If profile doesn't exist, create one for OAuth users
      if (!profile) {
        const username = data.user.user_metadata?.full_name?.toLowerCase().replace(/\s+/g, '_') ||
                        data.user.email?.split('@')[0] ||
                        `user_${data.user.id.slice(0, 8)}`;

        await supabase.from('profiles').insert({
          id: data.user.id,
          username: username,
          full_name: data.user.user_metadata?.full_name || '',
          avatar_url: avatarUrl,
          experience_level: 'beginner',
        });
      } else if (avatarUrl && !profile.avatar_url) {
        // Update existing profile if it doesn't have an avatar
        await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('id', data.user.id);
      }

      // Return response with cookies properly set
      return response;
    }
  }

  // Return to signin if something went wrong
  const redirectUrl = new URL('/signin', origin);
  return NextResponse.redirect(redirectUrl);
}
