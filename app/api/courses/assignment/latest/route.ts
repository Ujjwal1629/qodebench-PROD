import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Most recent submission for one assignment, so the panel can restore the
// learner's work instead of showing an empty form.

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
    .from('course_assignment_submissions')
    .select('answers, score, completed, created_at')
    .eq('user_id', user.id)
    .eq('course_slug', courseSlug)
    .eq('item_title', itemTitle)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('assignment latest failed:', error);
    return NextResponse.json({ error: 'Could not load submission' }, { status: 500 });
  }

  if (!data) return NextResponse.json({ attempt: null });

  return NextResponse.json({
    attempt: {
      answers: data.answers ?? {},
      score: data.score,
      completed: data.completed,
      submittedAt: data.created_at,
    },
  });
}
