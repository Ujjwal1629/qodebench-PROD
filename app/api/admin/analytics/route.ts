import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { metrics } from '@/lib/utils/metrics';
import { getRateLimiterStatus } from '@/lib/utils/redis-rate-limiter';

/**
 * Admin Analytics API
 *
 * Returns comprehensive analytics data including:
 * - Real-time metrics (requests, errors, latency)
 * - Database stats (users, challenges, submissions)
 * - Feature usage
 * - System health
 *
 * Access: Admin users only (checked via profile.is_admin)
 */

// Simple admin check - in production, use proper RBAC
async function isAdminUser(userId: string, userEmail: string | undefined, supabase: any): Promise<boolean> {
  // First check: admin emails from env (fastest check)
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  if (userEmail && adminEmails.includes(userEmail.toLowerCase())) {
    return true;
  }

  // Second check: is_admin flag in profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();

  if (profile?.is_admin) return true;

  return false;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin access (pass user.email from auth)
    const isAdmin = await isAdminUser(user.id, user.email, supabase);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get query params for time range
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '24h';

    // Calculate date range
    let startDate = new Date();
    switch (range) {
      case '1h':
        startDate.setHours(startDate.getHours() - 1);
        break;
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setHours(startDate.getHours() - 24);
    }

    // Get real-time metrics from metrics collector
    const realtimeMetrics = metrics.getDashboardData();

    // Get database stats (run queries in parallel)
    const [
      usersResult,
      activeUsersResult,
      challengesResult,
      submissionsResult,
      interviewsResult,
      subscriptionsResult,
      recentSubmissions,
      recentSignups,
    ] = await Promise.all([
      // Total users
      supabase.from('profiles').select('id', { count: 'exact', head: true }),

      // Active users (with activity in time range)
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('updated_at', startDate.toISOString()),

      // Total challenges
      supabase.from('challenges').select('id', { count: 'exact', head: true }),

      // Submissions in time range
      supabase
        .from('submissions')
        .select('id, status', { count: 'exact' })
        .gte('submitted_at', startDate.toISOString()),

      // Interviews in time range
      supabase
        .from('interview_sessions')
        .select('id, status', { count: 'exact' })
        .gte('created_at', startDate.toISOString()),

      // Active subscriptions
      supabase
        .from('subscriptions')
        .select('tier, status', { count: 'exact' })
        .eq('status', 'active'),

      // Recent submissions (for activity feed)
      supabase
        .from('submissions')
        .select('id, status, score, submitted_at, challenge_id')
        .order('submitted_at', { ascending: false })
        .limit(10),

      // Recent signups
      supabase
        .from('profiles')
        .select('id, username, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    // Calculate submission stats
    const submissionStats = {
      total: submissionsResult.count || 0,
      passed: submissionsResult.data?.filter((s: any) => s.status === 'passed').length || 0,
      failed: submissionsResult.data?.filter((s: any) => s.status === 'failed').length || 0,
    };

    // Calculate interview stats
    const interviewStats = {
      total: interviewsResult.count || 0,
      completed: interviewsResult.data?.filter((i: any) => i.status === 'completed').length || 0,
      inProgress: interviewsResult.data?.filter((i: any) => i.status === 'in_progress').length || 0,
    };

    // Get subscription breakdown
    const subscriptionBreakdown: Record<string, number> = {};
    subscriptionsResult.data?.forEach((sub: any) => {
      subscriptionBreakdown[sub.tier] = (subscriptionBreakdown[sub.tier] || 0) + 1;
    });

    // Get rate limiter status
    const rateLimiterStatus = await getRateLimiterStatus();

    // Build response
    const analyticsData = {
      // Time range
      range,
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString(),

      // Real-time server metrics
      realtime: realtimeMetrics,

      // Database stats
      database: {
        users: {
          total: usersResult.count || 0,
          activeInPeriod: activeUsersResult.count || 0,
        },
        challenges: {
          total: challengesResult.count || 0,
        },
        submissions: submissionStats,
        interviews: interviewStats,
        subscriptions: {
          total: subscriptionsResult.count || 0,
          breakdown: subscriptionBreakdown,
        },
      },

      // Recent activity
      recentActivity: {
        submissions: recentSubmissions.data || [],
        signups: recentSignups.data || [],
      },

      // System health
      system: {
        rateLimiter: rateLimiterStatus,
        nodeEnv: process.env.NODE_ENV,
        serverTime: new Date().toISOString(),
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
