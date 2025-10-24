import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LessonContent } from '@/components/ai-tools/lesson-content';

interface PageProps {
  params: Promise<{
    pathId: string;
    lessonId: string;
  }>;
}

async function getLessonData(pathId: string, lessonId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch lesson
  const { data: lesson, error: lessonError } = await supabase
    .from('ai_learning_lessons')
    .select('*')
    .eq('id', lessonId)
    .eq('learning_path_id', pathId)
    .single();

  if (lessonError || !lesson) {
    return null;
  }

  // Fetch path info
  const { data: path } = await supabase
    .from('ai_learning_paths')
    .select('title, id')
    .eq('id', pathId)
    .single();

  // Fetch all lessons in this path for navigation
  const { data: allLessons } = await supabase
    .from('ai_learning_lessons')
    .select('id, title, order_index')
    .eq('learning_path_id', pathId)
    .order('order_index');

  // Get user progress if logged in
  let progress = null;
  if (user) {
    const { data: progressData } = await supabase
      .from('ai_learning_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single();

    progress = progressData;
  }

  // Find prev/next lessons
  const currentIndex = allLessons?.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < (allLessons?.length ?? 0) - 1 ? allLessons?.[currentIndex + 1] : null;

  return {
    lesson,
    path,
    progress,
    prevLesson,
    nextLesson,
    currentLessonNumber: currentIndex + 1,
    totalLessons: allLessons?.length ?? 0,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pathId, lessonId } = await params;
  const data = await getLessonData(pathId, lessonId);

  if (!data) {
    return {
      title: 'Lesson Not Found | QodeBench',
    };
  }

  return {
    title: `${data.lesson.title} | ${data.path?.title} | QodeBench`,
    description: data.lesson.description,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { pathId, lessonId } = await params;
  const data = await getLessonData(pathId, lessonId);

  if (!data) {
    notFound();
  }

  const { lesson, path, progress, prevLesson, nextLesson, currentLessonNumber, totalLessons } =
    data;

  const isCompleted = progress?.status === 'completed';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Link href="/dashboard/ai-tools/learn" className="hover:text-slate-900">
          Learning Paths
        </Link>
        <ArrowRight className="h-4 w-4" />
        <Link href={`/dashboard/ai-tools/learn/${pathId}`} className="hover:text-slate-900">
          {path?.title}
        </Link>
        <ArrowRight className="h-4 w-4" />
        <span className="text-slate-900">Lesson {currentLessonNumber}</span>
      </div>

      {/* Lesson Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            Lesson {currentLessonNumber} of {totalLessons}
          </Badge>
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            {lesson.duration_minutes} min
          </Badge>
          {isCompleted && (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Completed
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
        <p className="text-lg text-slate-600">{lesson.description}</p>

        {lesson.learning_objectives.length > 0 && (
          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <h3 className="mb-3 font-semibold text-slate-900">What you'll learn:</h3>
              <ul className="space-y-2">
                {lesson.learning_objectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    <span className="text-slate-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Lesson Content */}
      <LessonContent
        lesson={lesson}
        progress={progress}
        pathId={pathId}
        lessonId={lessonId}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 border-t pt-6">
        {prevLesson ? (
          <Link href={`/dashboard/ai-tools/learn/${pathId}/lesson/${prevLesson.id}`}>
            <Button variant="outline">
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Previous Lesson
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link href={`/dashboard/ai-tools/learn/${pathId}/lesson/${nextLesson.id}`}>
            <Button>
              Next Lesson
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Link href={`/dashboard/ai-tools/learn/${pathId}`}>
            <Button>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete Path
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
