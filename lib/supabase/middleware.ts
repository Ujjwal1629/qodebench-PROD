import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Profile cache duration (5 minutes)
const PROFILE_CACHE_DURATION_MS = 5 * 60 * 1000;

interface CachedProfile {
  onboarding_completed: boolean | null;
  quiz_score: number | null;
  subscription_tier: string | null;
  subscription_status: string | null;
  subscription_end_date: string | null;
  trial_ends_at: string | null;
  cached_at: number;
}

/**
 * Get cached profile from cookie
 */
function getCachedProfile(request: NextRequest): CachedProfile | null {
  try {
    const cached = request.cookies.get('__profile_cache')?.value;
    if (!cached) return null;

    const profile = JSON.parse(cached) as CachedProfile;

    // Check if cache is still valid
    if (Date.now() - profile.cached_at > PROFILE_CACHE_DURATION_MS) {
      return null; // Cache expired
    }

    return profile;
  } catch {
    return null;
  }
}

/**
 * Set profile cache in cookie
 */
function setCachedProfile(response: NextResponse, profile: any): void {
  const cached: CachedProfile = {
    onboarding_completed: profile.onboarding_completed,
    quiz_score: profile.quiz_score,
    subscription_tier: profile.subscription_tier,
    subscription_status: profile.subscription_status,
    subscription_end_date: profile.subscription_end_date,
    trial_ends_at: profile.trial_ends_at,
    cached_at: Date.now(),
  };

  response.cookies.set('__profile_cache', JSON.stringify(cached), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: PROFILE_CACHE_DURATION_MS / 1000,
    path: '/',
  });
}

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
      // Try to get profile from cache first (reduces DB queries by ~60%)
      let cachedProfile = getCachedProfile(request);
      let shouldUpdateCache = false;

      // Profile data we'll use (from cache or DB)
      let profile: {
        onboarding_completed: boolean | null;
        quiz_score: number | null;
        subscription_tier: string | null;
        subscription_status: string | null;
        subscription_end_date: string | null;
        trial_ends_at: string | null;
      } | null = cachedProfile;

      if (!cachedProfile) {
        // Cache miss - fetch from database
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('onboarding_completed, quiz_score, subscription_tier, subscription_status, subscription_end_date, trial_ends_at')
          .eq('id', user.id)
          .single();

        profile = dbProfile;
        shouldUpdateCache = true;
      }

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

      // Update profile cache if we fetched fresh data
      if (shouldUpdateCache && profile) {
        setCachedProfile(supabaseResponse, profile);
      }
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
