import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Temporary debug endpoint - remove in production
export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username, avatar_url, full_name')
    .eq('id', user.id)
    .single();

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
    },
    profile,
    errors: {
      authError,
      profileError,
    },
  });
}
