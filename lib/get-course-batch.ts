import { createClient } from '@/lib/supabase/server';
import { isBatchId, type BatchId } from '@/lib/course-batches';

// The signed-in learner's batch for a course, or null when they haven't been
// assigned one (they then see the default recordings).
export async function getCourseBatch(courseSlug: string): Promise<BatchId | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // course_enrollments is newer than the generated Database types.
  const { data } = await (supabase as any)
    .from('course_enrollments')
    .select('batch')
    .eq('user_id', user.id)
    .eq('course_slug', courseSlug)
    .maybeSingle();

  const batch = (data as { batch?: unknown } | null)?.batch;
  return isBatchId(batch) ? batch : null;
}
