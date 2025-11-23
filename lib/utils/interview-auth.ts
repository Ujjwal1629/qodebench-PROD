/**
 * Interview Authorization Utilities
 *
 * SECURITY: Ensures users can only access their own interview data
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Verify that the authenticated user owns the interview session
 *
 * @param sessionId - The interview session ID to verify
 * @param userId - The authenticated user's ID
 * @returns Object with { authorized: boolean, error?: NextResponse }
 */
export async function verifySessionOwnership(
  sessionId: string,
  userId: string
): Promise<{ authorized: boolean; error?: NextResponse }> {
  try {
    const supabase = await createClient();

    // Fetch the session and verify ownership
    const { data: session, error } = await supabase
      .from('interview_sessions')
      .select('user_id')
      .eq('id', sessionId)
      .single();

    if (error || !session) {
      return {
        authorized: false,
        error: NextResponse.json(
          { error: 'Interview session not found' },
          { status: 404 }
        ),
      };
    }

    // CRITICAL: Verify the session belongs to the authenticated user
    if (session.user_id !== userId) {
      return {
        authorized: false,
        error: NextResponse.json(
          { error: 'Unauthorized: You can only access your own interview sessions' },
          { status: 403 }
        ),
      };
    }

    return { authorized: true };
  } catch (err) {
    console.error('Error verifying session ownership:', err);
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'Failed to verify session ownership' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Verify that the authenticated user owns the interview response
 *
 * @param responseId - The response ID to verify
 * @param userId - The authenticated user's ID
 * @returns Object with { authorized: boolean, sessionId?: string, error?: NextResponse }
 */
export async function verifyResponseOwnership(
  responseId: string,
  userId: string
): Promise<{ authorized: boolean; sessionId?: string; error?: NextResponse }> {
  try {
    const supabase = await createClient();

    // Fetch the response with session info for ownership verification
    const { data: response, error } = await supabase
      .from('interview_responses')
      .select('session_id, interview_sessions!inner(user_id)')
      .eq('id', responseId)
      .single();

    if (error || !response) {
      return {
        authorized: false,
        error: NextResponse.json(
          { error: 'Interview response not found' },
          { status: 404 }
        ),
      };
    }

    const responseUserId = (response.interview_sessions as any)?.user_id;

    // CRITICAL: Verify the response belongs to the authenticated user
    if (!responseUserId || responseUserId !== userId) {
      return {
        authorized: false,
        error: NextResponse.json(
          { error: 'Unauthorized: You can only access your own interview responses' },
          { status: 403 }
        ),
      };
    }

    return {
      authorized: true,
      sessionId: response.session_id
    };
  } catch (err) {
    console.error('Error verifying response ownership:', err);
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'Failed to verify response ownership' },
        { status: 500 }
      ),
    };
  }
}
