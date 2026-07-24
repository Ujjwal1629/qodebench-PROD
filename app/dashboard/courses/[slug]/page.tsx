import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSubscription } from '@/lib/get-subscription';
import { COURSES, type Course } from '@/lib/course-catalog';
import { AI_TESTING_NOTES } from '@/lib/course-content/ai-testing-notes';
import { AI_TESTING_VIDEOS, AI_TESTING_CHAPTERS, SESSION_COVERS, type VideoChapter } from '@/lib/course-content/ai-testing-videos';
import { AI_TESTING_MCQS, type MCQ } from '@/lib/course-content/ai-testing-mcqs';
import { AI_TESTING_PRACTICE, type PracticeSet } from '@/lib/course-content/ai-testing-practice';
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
  let mcqsBySession: Record<string, MCQ[]> = {};
  let practiceBySession: Record<string, PracticeSet> = {};

  if (slug === 'ai-powered-testing') {
    // Session-level notes + videos + MCQs + practice, matched by item title against the catalog
    course.phases.forEach((phase, pi) => {
      phase.modules.forEach((module, mi) => {
        module.lessons.forEach((lesson, li) => {
          const key = `${pi}:${mi}:${li}`;
          // A full-session item may cover several topics (SESSION_COVERS) —
          // merge those topics' notes and MCQs under the session.
          const covered = SESSION_COVERS[lesson] ?? [lesson];
          const content = covered
            .map((topic) => AI_TESTING_NOTES[topic])
            .filter(Boolean)
            .join('\n\n---\n\n');
          if (content) {
            notesBySession[key] = { title: lesson, content };
          }
          const playbackId = AI_TESTING_VIDEOS[lesson];
          if (playbackId) {
            videosBySession[key] = playbackId;
          }
          const videoChapters = AI_TESTING_CHAPTERS[lesson];
          if (videoChapters?.length) {
            chaptersBySession[key] = videoChapters;
          }
          const mcqs = covered.flatMap((topic) => AI_TESTING_MCQS[topic] ?? []);
          if (mcqs.length) {
            mcqsBySession[key] = mcqs;
          }
          const practice = AI_TESTING_PRACTICE[lesson];
          if (practice) {
            practiceBySession[key] = practice;
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
      mcqsBySession={mcqsBySession}
      practiceBySession={practiceBySession}
    />
  );
}
