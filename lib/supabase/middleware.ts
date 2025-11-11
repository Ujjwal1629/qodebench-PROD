import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/signin',
    '/signup',
    '/reset-password',
    '/update-password',
    '/about',
    '/careers',
    '/contact',
    '/mission',
    '/privacy',
    '/terms',
    '/refund-policy',
    '/cookies',
    '/documentation',
    '/blog',
    '/ai-tools-guide',
    '/tutorials',
    '/auth/callback',
    '/pricing', // Pricing page is public so expired users can upgrade
  ];

  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/')
  );

  // Protected routes check - redirect to signin if not authenticated and not on a public route
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (user && (request.nextUrl.pathname.startsWith('/signin') || request.nextUrl.pathname.startsWith('/signup'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Check onboarding status and subscription for authenticated users
  if (user) {
    const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding');
    const isDashboardOrProtectedRoute =
      request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/challenges') ||
      request.nextUrl.pathname.startsWith('/leaderboard') ||
      request.nextUrl.pathname.startsWith('/settings') ||
      request.nextUrl.pathname.startsWith('/interviews') ||
      request.nextUrl.pathname.startsWith('/rewards');

    // Only check onboarding and subscription for protected routes
    if (isDashboardOrProtectedRoute || isOnboardingRoute) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, quiz_score, subscription_tier, subscription_status, subscription_end_date, trial_ends_at')
        .eq('id', user.id)
        .single();

      // Redirect to quiz if onboarding not completed and not already on quiz page
      if (profile && !profile.onboarding_completed && !request.nextUrl.pathname.startsWith('/onboarding/quiz')) {
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding/quiz';
        return NextResponse.redirect(url);
      }

      // Redirect away from quiz if user already completed it (but allow retaking if they skipped)
      if (profile && profile.onboarding_completed && profile.quiz_score !== null && request.nextUrl.pathname.startsWith('/onboarding/quiz')) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }

      // Check subscription status for expired subscriptions
      if (profile) {
        const now = new Date();

        // A subscription is expired if:
        // 1. Status is 'expired', OR
        // 2. End date has passed (applies to active, trial, AND cancelled subscriptions), OR
        // 3. Trial has ended for beta tier
        const isExpired =
          profile.subscription_status === 'expired' ||
          (profile.subscription_end_date && new Date(profile.subscription_end_date) < now) ||
          (profile.trial_ends_at && new Date(profile.trial_ends_at) < now && profile.subscription_tier === 'beta');

        // If subscription expired by date (not just cancelled), update status in database (fire and forget)
        // Note: Cancelled subscriptions retain access until end_date, so don't mark them expired prematurely
        if (isExpired && profile.subscription_status !== 'expired') {
          supabase
            .from('profiles')
            .update({
              subscription_status: 'expired',
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .then(() => console.log('Updated expired subscription status'));
        }

        // Don't redirect on pricing, dashboard root, settings (all settings pages), or learning routes
        const isPricingRoute = request.nextUrl.pathname === '/pricing';
        const isDashboardRoot = request.nextUrl.pathname === '/dashboard';
        const isSettingsRoute = request.nextUrl.pathname.startsWith('/dashboard/settings');
        const isLearningRoute = request.nextUrl.pathname.startsWith('/dashboard/learning');
        const isChallengesListRoute = request.nextUrl.pathname === '/dashboard/challenges';

        // Allow access to pricing, dashboard root, all settings pages, learning, and challenge list even if expired
        // This lets users see what they're missing, manage their profile, and upgrade
        const allowedRoutesWhenExpired =
          isPricingRoute ||
          isDashboardRoot ||
          isSettingsRoute ||
          isLearningRoute ||
          isChallengesListRoute;

        // Redirect expired users away from paid content (but not from allowed routes)
        if (isExpired && !allowedRoutesWhenExpired) {
          const url = request.nextUrl.clone();
          url.pathname = '/pricing';
          url.searchParams.set('expired', 'true');
          return NextResponse.redirect(url);
        }
      }

      // Allow users to retake quiz if they skipped (onboarding completed but no quiz score)
      // Don't redirect them away from quiz page in this case
    }
  }

  // Add cache control headers to prevent browser caching of protected routes
  // This prevents users from accessing cached pages after logout using back button
  if (user && !request.nextUrl.pathname.startsWith('/signin') && !request.nextUrl.pathname.startsWith('/signup')) {
    supabaseResponse.headers.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
    supabaseResponse.headers.set('Pragma', 'no-cache');
    supabaseResponse.headers.set('Expires', '0');
  }

  return supabaseResponse;
}
