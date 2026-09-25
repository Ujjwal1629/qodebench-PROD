import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Save an assignment submission. Assignments are homework, so "score" is how
// much of the work was genuinely filled in, not a right/wrong grade.

export const dynamic = 'force-dynamic';

interface Body {
  courseSlug?: string;
  itemTitle?: string;
  answers?: Record<string, unknown>;
  score?: number;
  completed?: boolean;
  totalTasks?: number;
  doneTasks?: number;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { courseSlug, itemTitle, answers, score, completed, totalTasks, doneTasks } = body;
  if (!courseSlug || !itemTitle || typeof score !== 'number') {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  const { error } = await supabase.from('course_assignment_submissions').insert({
    user_id: user.id,
    course_slug: courseSlug,
    item_title: itemTitle,
    answers: answers ?? {},
    score: safeScore,
    completed: Boolean(completed),
    total_tasks: totalTasks ?? 0,
    done_tasks: doneTasks ?? 0,
  });

  if (error) {
    console.error('assignment submit failed:', error);
    return NextResponse.json({ error: 'Could not save submission' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, score: safeScore });
}
