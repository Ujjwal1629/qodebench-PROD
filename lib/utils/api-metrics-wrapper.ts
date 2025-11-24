/**
 * API Metrics Wrapper
 *
 * Wraps API route handlers to automatically track:
 * - Request count
 * - Latency
 * - Errors
 * - Active users
 *
 * Usage:
 * ```
 * import { withMetrics } from '@/lib/utils/api-metrics-wrapper';
 *
 * export const POST = withMetrics(async (req: NextRequest) => {
 *   // your handler code
 *   return NextResponse.json({ success: true });
 * }, 'challenge_submit');
 * ```
 */

import { NextRequest, NextResponse } from 'next/server';
import { metrics, FEATURES } from './metrics';
import { createClient } from '@/lib/supabase/server';

type ApiHandler = (req: NextRequest) => Promise<NextResponse | Response>;

/**
 * Wrap an API handler with automatic metrics tracking
 */
export function withMetrics(
  handler: ApiHandler,
  featureName?: string
): ApiHandler {
  return async (req: NextRequest) => {
    const startTime = Date.now();
    const url = new URL(req.url);
    const endpoint = url.pathname;
    const method = req.method;

    let userId: string | undefined;
    let statusCode = 200;

    try {
      // Try to get user ID for active user tracking
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
      } catch {
        // Ignore auth errors - user might not be logged in
      }

      // Execute the actual handler
      const response = await handler(req);
      statusCode = response.status;

      // Track the request
      const latency = Date.now() - startTime;
      metrics.trackRequest(endpoint, method, latency, statusCode, userId);

      // Track feature usage if specified
      if (featureName && statusCode < 400) {
        metrics.trackFeature(featureName, userId);
      }

      return response;
    } catch (error) {
      // Track error
      statusCode = 500;
      const latency = Date.now() - startTime;
      metrics.trackRequest(endpoint, method, latency, statusCode, userId);

      throw error;
    }
  };
}

/**
 * Simple function to track a request without wrapping
 * Use this when you can't use the wrapper
 */
export function trackApiRequest(
  req: NextRequest,
  statusCode: number,
  startTime: number,
  userId?: string,
  featureName?: string
): void {
  const url = new URL(req.url);
  const endpoint = url.pathname;
  const method = req.method;
  const latency = Date.now() - startTime;

  metrics.trackRequest(endpoint, method, latency, statusCode, userId);

  if (featureName && statusCode < 400) {
    metrics.trackFeature(featureName, userId);
  }
}

// Re-export FEATURES for convenience
export { FEATURES };
