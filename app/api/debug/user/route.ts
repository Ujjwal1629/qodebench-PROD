import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Debug endpoint - ADMIN ONLY
 * Only accessible in development or by admin users
 */
export async function GET() {
  // Block in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DEBUG_ENDPOINTS !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // In production, verify user is admin
  if (process.env.NODE_ENV === 'production') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  // Only return non-sensitive information
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username, full_name, subscription_tier, subscription_status')
    .eq('id', user.id)
    .single();

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      // Don't expose user_metadata in production
      ...(process.env.NODE_ENV !== 'production' && { user_metadata: user.user_metadata }),
    },
    profile: profile
      ? {
          username: profile.username,
          fullName: profile.full_name,
          subscriptionTier: profile.subscription_tier,
          subscriptionStatus: profile.subscription_status,
        }
      : null,
    // Don't expose errors in production
    ...(process.env.NODE_ENV !== 'production' && {
      errors: { authError, profileError },
    }),
  });
}
