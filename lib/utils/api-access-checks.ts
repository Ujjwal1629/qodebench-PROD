/**
 * Reusable access check helpers for API routes
 * These should be used at the beginning of all protected API endpoints
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canAccessInterviews } from '@/lib/utils/subscription-check';

/**
 * Verify user is authenticated
 * Returns user if authenticated, or error response if not
 */
export async function verifyAuthentication() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return { user, error: null };
}

/**
 * Verify user has access to interview prep
 * Should be called after verifyAuthentication
 */
export async function verifyInterviewAccess(userId: string) {
  const accessCheck = await canAccessInterviews(userId);

  if (!accessCheck.canAccess) {
    return {
      hasAccess: false,
      error: NextResponse.json(
        {
          error: 'Access denied',
          message: accessCheck.reason,
          requiresUpgrade: true,
        },
        { status: 403 }
      ),
    };
  }

  return { hasAccess: true, error: null };
}

/**
 * Combined authentication and interview access check
 * Use this at the beginning of interview API routes
 */
export async function verifyInterviewAPIAccess() {
  // Check authentication
  const authResult = await verifyAuthentication();
  if (authResult.error) {
    return { user: null, error: authResult.error };
  }

  // Check interview access
  const accessResult = await verifyInterviewAccess(authResult.user!.id);
  if (accessResult.error) {
    return { user: null, error: accessResult.error };
  }

  return { user: authResult.user, error: null };
}
