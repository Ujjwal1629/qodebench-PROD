import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Best score per practice item for one course, so the player can mark which
// items the learner has already done and show the score in the sidebar.

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
  if (!courseSlug) {
    return NextResponse.json({ error: 'Missing courseSlug' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('course_practice_submissions')
    .select('item_title, score, passed, created_at')
    .eq('user_id', user.id)
    .eq('course_slug', courseSlug)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('practice progress failed:', error);
    return NextResponse.json({ error: 'Could not load progress' }, { status: 500 });
  }

  // Keep the BEST score per item, plus how many times it was attempted, so a
  // later worse attempt never erases a learner's completed badge.
  const byItem: Record<
    string,
    { score: number; passed: boolean; attempts: number; lastAt: string }
  > = {};

  for (const row of (data ?? []) as {
    item_title: string;
    score: number;
    passed: boolean;
    created_at: string;
  }[]) {
    const cur = byItem[row.item_title];
    if (!cur) {
      // Rows arrive newest-first, so the first one seen is the latest attempt.
      byItem[row.item_title] = {
        score: row.score,
        passed: row.passed,
        attempts: 1,
        lastAt: row.created_at,
      };
      continue;
    }
    cur.attempts += 1;
    if (row.score > cur.score) {
      cur.score = row.score;
      cur.passed = row.passed;
    }
  }

  return NextResponse.json({ progress: byItem });
}
