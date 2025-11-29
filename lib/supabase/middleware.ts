import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Profile cache duration (1 minute - short TTL for security)
// Only caches non-sensitive onboarding data, NOT subscription data
const PROFILE_CACHE_DURATION_MS = 1 * 60 * 1000;

// SECURITY: Only cache non-sensitive data
// Subscription data must ALWAYS be verified server-side to prevent tampering
interface CachedProfile {
  onboarding_completed: boolean | null;
  quiz_score: number | null;
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
 * SECURITY: Only caches onboarding data, NOT subscription data
 */
function setCachedProfile(response: NextResponse, profile: any): void {
  const cached: CachedProfile = {
    onboarding_completed: profile.onboarding_completed,
    quiz_score: profile.quiz_score,
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
    '/refund-policy',
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
      // Try to get onboarding data from cache first (reduces DB queries)
      let cachedProfile = getCachedProfile(request);
      let shouldUpdateCache = false;

      // SECURITY: Always fetch subscription data from DB (never cache sensitive payment info)
      // Only cache onboarding status to reduce queries
      let onboardingData: {
        onboarding_completed: boolean | null;
        quiz_score: number | null;
      } | null = cachedProfile;

      let subscriptionData: {
        subscription_tier: string | null;
        subscription_status: string | null;
        subscription_end_date: string | null;
        trial_ends_at: string | null;
      } | null = null;

      if (!cachedProfile) {
        // Cache miss - fetch onboarding data from database
        const { data: dbOnboarding } = await supabase
          .from('profiles')
          .select('onboarding_completed, quiz_score')
          .eq('id', user.id)
          .single();

        onboardingData = dbOnboarding;
        shouldUpdateCache = true;
      }

      // ALWAYS fetch subscription data (no caching for security)
      const { data: dbSubscription } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status, subscription_end_date, trial_ends_at')
        .eq('id', user.id)
        .single();

      subscriptionData = dbSubscription;

      // Redirect to quiz if onboarding not completed and not already on quiz page
      if (onboardingData && !onboardingData.onboarding_completed && !request.nextUrl.pathname.startsWith('/onboarding/quiz')) {
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding/quiz';
        return NextResponse.redirect(url);
      }

      // Redirect away from quiz if user already completed it (but allow retaking if they skipped)
      if (onboardingData && onboardingData.onboarding_completed && onboardingData.quiz_score !== null && request.nextUrl.pathname.startsWith('/onboarding/quiz')) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }

      // Check subscription status for expired subscriptions
      if (subscriptionData) {
        const now = new Date();

        // A subscription is expired if:
        // 1. Status is 'expired', OR
        // 2. End date has passed (applies to active, trial, AND cancelled subscriptions), OR
        // 3. Trial has ended for launch offer tier
        const isExpired =
          subscriptionData.subscription_status === 'expired' ||
          (subscriptionData.subscription_end_date && new Date(subscriptionData.subscription_end_date) < now) ||
          (subscriptionData.trial_ends_at && new Date(subscriptionData.trial_ends_at) < now && subscriptionData.subscription_tier === 'launch_offer');

        // If subscription expired by date (not just cancelled), update status in database (with await for reliability)
        // Note: Cancelled subscriptions retain access until end_date, so don't mark them expired prematurely
        if (isExpired && subscriptionData.subscription_status !== 'expired') {
          supabase
            .from('profiles')
            .update({
              subscription_status: 'expired',
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .then(() => console.log('Updated expired subscription status'));
        }

        // Don't redirect on pricing, dashboard root, settings (all settings pages), learning, or challenges routes
        const isPricingRoute = request.nextUrl.pathname === '/pricing';
        const isDashboardRoot = request.nextUrl.pathname === '/dashboard';
        const isSettingsRoute = request.nextUrl.pathname.startsWith('/dashboard/settings');
        const isLearningRoute = request.nextUrl.pathname.startsWith('/dashboard/learning');
        // Allow all challenges routes - let individual challenge pages handle access control
        // This allows browsing categories (practical, advanced, etc.) and seeing what's available
        const isChallengesRoute = request.nextUrl.pathname.startsWith('/dashboard/challenges');

        // Allow access to pricing, dashboard root, settings, learning, and all challenges routes even if expired
        // This lets users browse available challenges, see what they're missing, manage profile, and upgrade
        // Individual challenge pages will handle their own access control for premium content
        const allowedRoutesWhenExpired =
          isPricingRoute ||
          isDashboardRoot ||
          isSettingsRoute ||
          isLearningRoute ||
          isChallengesRoute;

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

      // Update onboarding cache if we fetched fresh data (subscription data is never cached)
      if (shouldUpdateCache && onboardingData) {
        setCachedProfile(supabaseResponse, onboardingData);
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
