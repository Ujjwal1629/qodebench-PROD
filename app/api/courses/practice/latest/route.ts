import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Return the learner's most recent attempt at one practice item, so the
// workspace can restore their answers instead of showing a blank form.
// Counterpart to POST /api/courses/practice/submit.

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const courseSlug = req.nextUrl.searchParams.get('courseSlug');
  const itemTitle = req.nextUrl.searchParams.get('itemTitle');
  if (!courseSlug || !itemTitle) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('course_practice_submissions')
    .select('answers, score, passed, created_at')
    .eq('user_id', user.id)
    .eq('course_slug', courseSlug)
    .eq('item_title', itemTitle)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('practice latest failed:', error);
    return NextResponse.json({ error: 'Could not load attempt' }, { status: 500 });
  }

  // No previous attempt is a normal state, not an error.
  if (!data) return NextResponse.json({ attempt: null });

  return NextResponse.json({
    attempt: {
      answers: data.answers ?? {},
      score: data.score,
      passed: data.passed,
      submittedAt: data.created_at,
    },
  });
}
