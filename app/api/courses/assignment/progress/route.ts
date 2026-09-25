import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Best score per assignment for one course, so the sidebar can show which
// assignments the learner has already submitted.

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
    .from('course_assignment_submissions')
    .select('item_title, score, completed, created_at')
    .eq('user_id', user.id)
    .eq('course_slug', courseSlug)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('assignment progress failed:', error);
    return NextResponse.json({ error: 'Could not load progress' }, { status: 500 });
  }

  // Keep the BEST score per item so a later partial save never erases a
  // completed badge.
  const byItem: Record<string, { score: number; completed: boolean; attempts: number }> = {};
  for (const row of (data ?? []) as {
    item_title: string;
    score: number;
    completed: boolean;
  }[]) {
    const cur = byItem[row.item_title];
    if (!cur) {
      byItem[row.item_title] = { score: row.score, completed: row.completed, attempts: 1 };
      continue;
    }
    cur.attempts += 1;
    if (row.score > cur.score) {
      cur.score = row.score;
      cur.completed = row.completed;
    }
  }

  return NextResponse.json({ progress: byItem });
}
