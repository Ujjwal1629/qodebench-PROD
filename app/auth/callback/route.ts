import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
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
          avatar_url: data.user.user_metadata?.avatar_url || null,
          experience_level: 'beginner',
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to signin if something went wrong
  return NextResponse.redirect(`${origin}/signin`);
}
