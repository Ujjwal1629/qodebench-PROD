import { createClient } from '@/lib/supabase/server';
import { COURSES, type Course } from '@/lib/course-catalog';
import { isPracticeTitle } from '@/lib/course-utils';

// Per-course progress for the dashboard. The only progress we persist today is
// practice attempts (`course_practice_submissions`, keyed by item_title), so
// progress is measured as "practice/assignment items passed". "Next up" is the
// first item in the curriculum the learner hasn't passed yet, deep-linked into
// the course player via ?lesson=phase:module:lesson.

export interface CourseProgress {
  slug: string;
  title: string;
  /** Total practice + assignment items across the whole course. */
  totalPractice: number;
  /** Distinct practice items the learner has passed. */
  passedPractice: number;
  /** 0–100, rounded. */
  percent: number;
  /** Deep-link target: "phase:module:lesson" of the first not-yet-passed item. */
  nextLessonKey: string | null;
  /** Human title of that next item. */
  nextLessonTitle: string | null;
  /** Module the next item lives in (for context lines). */
  nextModuleTitle: string | null;
  /** Most recent submission time across this course, or null if never touched. */
  lastActivityAt: string | null;
}

function practiceItemKeys(course: Course): {
  key: string;
  title: string;
  moduleTitle: string;
}[] {
  const out: { key: string; title: string; moduleTitle: string }[] = [];
  course.phases.forEach((phase, pi) => {
    phase.modules.forEach((mod, mi) => {
      mod.lessons.forEach((lesson, li) => {
        if (isPracticeTitle(lesson)) {
          out.push({
            key: `${pi}:${mi}:${li}`,
            title: lesson,
            moduleTitle: mod.title,
          });
        }
      });
    });
  });
  return out;
}

// The first lesson in the course, used as the resume target for a learner who
// hasn't passed anything yet (so "Next up" always points somewhere real).
function firstLessonKey(course: Course): {
  key: string;
  title: string;
  moduleTitle: string;
} | null {
  for (let pi = 0; pi < course.phases.length; pi++) {
    const phase = course.phases[pi];
    for (let mi = 0; mi < phase.modules.length; mi++) {
      const mod = phase.modules[mi];
      if (mod.lessons.length > 0) {
        return { key: `${pi}:${mi}:0`, title: mod.lessons[0], moduleTitle: mod.title };
      }
    }
  }
  return null;
}

export async function getCourseProgress(): Promise<CourseProgress[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Map of course_slug -> Set(item_title passed) and latest activity time.
  const passedByCourse = new Map<string, Set<string>>();
  const lastByCourse = new Map<string, string>();

  if (user) {
    const { data } = await supabase
      .from('course_practice_submissions')
      .select('course_slug, item_title, passed, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    for (const row of (data ?? []) as {
      course_slug: string;
      item_title: string;
      passed: boolean;
      created_at: string;
    }[]) {
      if (!lastByCourse.has(row.course_slug)) {
        lastByCourse.set(row.course_slug, row.created_at);
      }
      if (row.passed) {
        const set = passedByCourse.get(row.course_slug) ?? new Set<string>();
        set.add(row.item_title);
        passedByCourse.set(row.course_slug, set);
      }
    }
  }

  return COURSES.map((course) => {
    const items = practiceItemKeys(course);
    const passedSet = passedByCourse.get(course.slug) ?? new Set<string>();
    const passedPractice = items.filter((it) => passedSet.has(it.title)).length;
    const totalPractice = items.length;

    const nextItem = items.find((it) => !passedSet.has(it.title)) ?? null;
    // If every practice item is passed (or there are none), fall back to the
    // course's first lesson so the resume link still works.
    const resume = nextItem ?? firstLessonKey(course);

    return {
      slug: course.slug,
      title: course.title,
      totalPractice,
      passedPractice,
      percent:
        totalPractice > 0
          ? Math.round((passedPractice / totalPractice) * 100)
          : 0,
      nextLessonKey: resume?.key ?? null,
      nextLessonTitle: resume?.title ?? null,
      nextModuleTitle: resume?.moduleTitle ?? null,
      lastActivityAt: lastByCourse.get(course.slug) ?? null,
    };
  });
}
