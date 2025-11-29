import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ProgressService } from '@/lib/learning/progress-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  Lock,
  Clock,
  Trophy,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import {
  LessonListSkeleton,
  LearningModuleHeaderSkeleton,
  LearningObjectivesSkeleton,
} from '@/components/learning/lesson-list-skeleton';

const JAVASCRIPT_PATH_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

// Separate component for lessons list with its own data fetching
async function LessonsList({ userId }: { userId: string }) {
  const lessonsWithAccess = await ProgressService.getLessonsWithAccess(
    userId,
    JAVASCRIPT_PATH_ID
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Lessons</h2>
      <div className="space-y-4">
        {lessonsWithAccess.map((lesson) => {
          const isCompleted = lesson.is_completed;
          const canAccess = lesson.can_access;
          const isLocked = !canAccess;

          return (
            <Card
              key={lesson.id}
              className={`border-2 transition-all ${
                isCompleted
                  ? 'border-green-200 bg-green-50/50'
                  : isLocked
                    ? 'border-slate-200 bg-slate-50'
                    : 'border-sky-200 bg-sky-50/30 hover:border-sky-400'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                    ) : isLocked ? (
                      <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center">
                        <Lock className="h-6 w-6 text-slate-600" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-sky-600 flex items-center justify-center">
                        <Circle className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-semibold">
                            Lesson {lesson.order_index}
                          </Badge>
                          <h3 className="text-xl font-semibold">{lesson.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.duration_minutes} min</span>
                      </div>
                    </div>

                    {/* Learning Objectives */}
                    <div className="flex flex-wrap gap-2">
                      {lesson.learning_objectives.slice(0, 2).map((obj: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {obj}
                        </Badge>
                      ))}
                      {lesson.learning_objectives.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{lesson.learning_objectives.length - 2} more
                        </Badge>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-4">
                      {isLocked ? (
                        <Button disabled variant="outline" className="w-40">
                          <Lock className="mr-2 h-4 w-4" />
                          Locked
                        </Button>
                      ) : isCompleted ? (
                        <Button
                          asChild
                          variant="outline"
                          className="w-40 border-green-600 text-green-700 hover:bg-green-50"
                        >
                          <Link href={`/dashboard/learning/javascript/${lesson.id}`}>
                            Review Lesson
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild className="w-40 bg-sky-600 hover:bg-sky-700">
                          <Link href={`/dashboard/learning/javascript/${lesson.id}`}>
                            Start Lesson
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}

                      {lesson.latest_score !== undefined && (
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={lesson.quiz_passed ? 'default' : 'secondary'}
                            className={lesson.quiz_passed ? 'bg-green-600' : ''}
                          >
                            Score: {lesson.latest_score}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Separate component for header with progress
async function ModuleHeader({ userId, learningPath }: { userId: string; learningPath: any }) {
  const progress = await ProgressService.getLearningPathProgress(userId, JAVASCRIPT_PATH_ID);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/learning" className="hover:text-sky-600 transition-colors">
          Learning
        </Link>
        <span>/</span>
        <span>JavaScript Essentials</span>
      </div>

      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-2">
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

        <Card className="w-64">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-sky-600">
                {progress.progress_percentage}%
              </span>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
            <Progress value={progress.progress_percentage} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {progress.completed_lessons} of {progress.total_lessons} lessons completed
            </p>
          </CardContent>
        </Card>
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

export default async function JavaScriptLearningPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  // OPTIMIZED: Get learning path details (fast query)
  const { data: learningPath } = await supabase
    .from('ai_learning_paths')
    .select('*')
    .eq('id', JAVASCRIPT_PATH_ID)
    .single();

  if (!learningPath) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Learning Path Not Found</CardTitle>
            <CardDescription>
              The JavaScript learning path could not be found. Please contact support.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // OPTIMIZED: Render with Suspense boundaries for better perceived performance
  // The header and lessons will load independently with loading states
  return (
    <div className="container space-y-8">
      {/* Header Section with Progress - Wrapped in Suspense */}
      <Suspense fallback={<LearningModuleHeaderSkeleton />}>
        <ModuleHeader userId={user.id} learningPath={learningPath} />
      </Suspense>

      {/* Learning Objectives - Static content, no need for Suspense */}
      <LearningObjectives learningPath={learningPath} />

      {/* Lessons List - Wrapped in Suspense */}
      <Suspense fallback={<LessonListSkeleton />}>
        <LessonsList userId={user.id} />
      </Suspense>
    </div>
  );
}
