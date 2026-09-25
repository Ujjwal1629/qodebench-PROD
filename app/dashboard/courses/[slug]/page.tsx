import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSubscription } from '@/lib/get-subscription';
import { COURSES, type Course } from '@/lib/course-catalog';
import { AI_TESTING_NOTES } from '@/lib/course-content/ai-testing-notes';
import { resolveSessionVideo, SESSION_COVERS, type VideoChapter } from '@/lib/course-content/ai-testing-videos';
import { getCourseBatch } from '@/lib/get-course-batch';
import { BATCHES } from '@/lib/course-batches';
import { AI_TESTING_PRACTICE, type PracticeSet } from '@/lib/course-content/ai-testing-practice';
import {
  AI_TESTING_ASSIGNMENTS,
  type AssignmentSet,
} from '@/lib/course-content/ai-testing-assignments';
import { CoursePlayer, type ModuleNotes } from '@/components/courses/course-player';

// The Playwright course content lives in the learning-module lessons. The player's
// sidebar and revision notes are both built from this table so they always match.
const PLAYWRIGHT_PATH_ID = 'f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c';

interface DbLesson {
  title: string;
  content: string | null;
  duration_minutes: number | null;
  learning_objectives: string[] | null;
}

async function getPlaywrightLessons(): Promise<DbLesson[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('ai_learning_lessons')
    .select('title, content, duration_minutes, learning_objectives, order_index')
    .eq('learning_path_id', PLAYWRIGHT_PATH_ID)
    .order('order_index', { ascending: true });

  return (data ?? []) as DbLesson[];
}

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = COURSES.find((c) => c.slug === slug);
  if (!course) notFound();

  // Coming-soon courses aren't openable, even via a direct URL.
  if (course.comingSoon) {
    redirect('/dashboard/courses');
  }

  const { isEnrolled } = await getSubscription();
  if (!isEnrolled) {
    redirect(`/pricing?course=${slug}`);
  }

  let courseForPlayer: Course = course;
  let notesByModule: ModuleNotes[] = [];
  let notesBySession: Record<string, ModuleNotes> = {};
  let videosBySession: Record<string, string> = {};
  let chaptersBySession: Record<string, VideoChapter[]> = {};
  let practiceBySession: Record<string, PracticeSet> = {};
  let assignmentsBySession: Record<string, AssignmentSet> = {};
  let batchLabel: string | undefined;

  if (slug === 'ai-powered-testing') {
    // Each batch (morning/afternoon/evening) sees its own class recordings.
    const batch = await getCourseBatch(slug);
    batchLabel = batch ? BATCHES[batch].label : undefined;

    // Session-level notes + videos + practice, matched by item title against the catalog
    course.phases.forEach((phase, pi) => {
      phase.modules.forEach((module, mi) => {
        module.lessons.forEach((lesson, li) => {
          const key = `${pi}:${mi}:${li}`;
          // A full-session item may cover several topics (SESSION_COVERS) —
          // merge those topics' notes under the session.
          const covered = SESSION_COVERS[lesson] ?? [lesson];
          const content = covered
            .map((topic) => AI_TESTING_NOTES[topic])
            .filter(Boolean)
            .join('\n\n---\n\n');
          if (content) {
            notesBySession[key] = { title: lesson, content };
          }
          const video = resolveSessionVideo(lesson, batch);
          if (video) {
            videosBySession[key] = video.playbackId;
            if (video.chapters.length) {
              chaptersBySession[key] = video.chapters;
            }
          }
          const practice = AI_TESTING_PRACTICE[lesson];
          if (practice) {
            practiceBySession[key] = practice;
          }
          const assignment = AI_TESTING_ASSIGNMENTS[lesson];
          if (assignment) {
            assignmentsBySession[key] = assignment;
          }
        });
      });
    });
  }

  if (slug === 'playwright-test-automation') {
    const lessons = await getPlaywrightLessons();
    if (lessons.length > 0) {
      courseForPlayer = {
        ...course,
        phases: [
          {
            name: course.phases[0].name,
            detail: `${lessons.length} lessons`,
            modules: lessons.map((lesson, i) => ({
              title: lesson.title,
              detail: lesson.duration_minutes
                ? `Lesson ${i + 1} · ${lesson.duration_minutes} min`
                : `Lesson ${i + 1}`,
              lessons: lesson.learning_objectives ?? [],
            })),
          },
        ],
      };
      notesByModule = lessons.map((lesson) => ({
        title: lesson.title,
        content: lesson.content ?? '',
      }));
    }
  }

  return (
    <CoursePlayer
      course={courseForPlayer}
      notesByModule={notesByModule}
      notesBySession={notesBySession}
      videosBySession={videosBySession}
      chaptersBySession={chaptersBySession}
      practiceBySession={practiceBySession}
      assignmentsBySession={assignmentsBySession}
      batchLabel={batchLabel}
    />
  );
}
