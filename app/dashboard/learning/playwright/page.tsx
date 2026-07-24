import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ProgressService } from '@/lib/learning/progress-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  CheckCircle2,
  CheckCircle,
  Lock,
  Clock,
  ArrowRight,
  BookOpen,
  BookOpenCheck,
  Crown,
} from 'lucide-react';
import {
  LessonListSkeleton,
} from '@/components/learning/lesson-list-skeleton';
import { FREE_LESSONS_PER_PATH } from '@/lib/learning/progress-service';

const PLAYWRIGHT_PATH_ID = 'f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c';

// Separate component for lessons list with its own data fetching
async function LessonsList({ userId }: { userId: string }) {
  const lessonsWithAccess = await ProgressService.getLessonsWithAccess(
    userId,
    PLAYWRIGHT_PATH_ID
  );

  console.log('[Playwright Page] Lessons fetched:', lessonsWithAccess.length);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Lessons</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessonsWithAccess.map((lesson) => {
          const isCompleted = lesson.is_completed;
          const canAccess = lesson.can_access;
          const isLocked = !canAccess;

          const cardContent = (
            <Card
              key={lesson.id}
              className={`relative overflow-hidden h-full border-2 transition-all ${
                isCompleted
                  ? 'border-green-200 bg-green-50/30 hover:border-green-400 cursor-pointer'
                  : isLocked
                    ? 'border-slate-200 bg-slate-50 opacity-60'
                    : 'border-brand-200 bg-brand-50/30 hover:border-brand-400 cursor-pointer'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-3 ${
                    isCompleted ? 'bg-green-100' : isLocked ? 'bg-slate-100' : 'bg-brand-100'
                  }`}>
                    {isCompleted
                      ? <BookOpenCheck className="h-6 w-6 text-green-600" />
                      : isLocked
                        ? <Lock className="h-6 w-6 text-slate-400" />
                        : <BookOpen className="h-6 w-6 text-brand-600" />
                    }
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Lesson {lesson.order_index}
                    </Badge>
                    <Badge variant="outline" className="text-xs gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.duration_minutes}m
                    </Badge>
                    {lesson.order_index <= FREE_LESSONS_PER_PATH ? (
                      <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
                        Free
                      </Badge>
                    ) : (
                      <Badge className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1">
                        <Crown className="h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="mt-4 text-base leading-snug">{lesson.title}</CardTitle>
                <CardDescription className="line-clamp-2">{lesson.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {isLocked ? (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Lock className="h-4 w-4" />
                      Locked
                    </div>
                  ) : isCompleted ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
                      <CheckCircle className="h-4 w-4" />
                      Start Lesson
                    </div>
                  )}
                  {!isLocked && <ArrowRight className="h-5 w-5 text-brand-600" />}
                </div>
                {lesson.latest_score !== undefined && (
                  <Badge
                    variant={lesson.quiz_passed ? 'default' : 'secondary'}
                    className={`mt-2 text-xs ${lesson.quiz_passed ? 'bg-green-600' : ''}`}
                  >
                    Quiz: {lesson.latest_score}%
                  </Badge>
                )}
              </CardContent>
            </Card>
          );

          return isLocked ? (
            <Link
              key={lesson.id}
              href="/pricing"
              className="block transition-transform hover:scale-[1.02]"
            >
              {cardContent}
            </Link>
          ) : (
            <Link
              key={lesson.id}
              href={`/dashboard/learning/playwright/${lesson.id}`}
              className="block transition-transform hover:scale-[1.02]"
            >
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ModuleHeader({ learningPath }: { learningPath: any }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/learning" className="hover:text-brand-600 transition-colors">
          Learning
        </Link>
        <span>/</span>
        <span>Playwright Test Automation</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{learningPath.icon}</div>
          <div>
            <h1 className="text-3xl font-bold">{learningPath.title}</h1>
            <Badge className="bg-green-100 text-green-800 mt-2">
              {learningPath.difficulty}
            </Badge>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">{learningPath.description}</p>
      </div>
    </div>
  );
}

// Learning objectives component (static, doesn't need Suspense)
function LearningObjectives({ learningPath }: { learningPath: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          What You'll Learn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {learningPath.learning_objectives.map((objective: string, index: number) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{objective}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default async function PlaywrightLearningPage() {
  console.log('[Playwright Page] Loading page...');
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log('[Playwright Page] No user, redirecting to signin');
    redirect('/signin');
  }

  console.log('[Playwright Page] User authenticated:', user.id);

  // OPTIMIZED: Get learning path details (fast query)
  const { data: learningPath, error: pathError } = await supabase
    .from('ai_learning_paths')
    .select('*')
    .eq('id', PLAYWRIGHT_PATH_ID)
    .single();

  if (pathError) {
    console.error('[Playwright Page] Error fetching learning path:', pathError);
  }

  if (!learningPath) {
    console.error('[Playwright Page] Learning path not found');
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Learning Path Not Found</CardTitle>
            <CardDescription>
              The Playwright learning path could not be found. Please contact support.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  console.log('[Playwright Page] Learning path found:', learningPath.title);

  // OPTIMIZED: Render with Suspense boundaries for better perceived performance
  // The header and lessons will load independently with loading states
  return (
    <div className="container space-y-8">
      <ModuleHeader learningPath={learningPath} />

      {/* Learning Objectives - Static content, no need for Suspense */}
      <LearningObjectives learningPath={learningPath} />

      {/* Lessons List - Wrapped in Suspense */}
      <Suspense fallback={<LessonListSkeleton />}>
        <LessonsList userId={user.id} />
      </Suspense>
    </div>
  );
}
