import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  Circle,
  TrendingUp,
  Code,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const metadata: Metadata = {
  title: 'Learning Paths | AI Tools Guide | QodeBench',
  description: 'Structured learning paths to master AI-powered development',
};

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  target_role: string[];
  tech_stack: string[];
  estimated_duration_hours: number;
  learning_objectives: string[];
  icon: string | null;
  order_index: number;
  lessons_count?: number;
  completed_lessons?: number;
  progress_percentage?: number;
}

async function getLearningPaths(): Promise<LearningPath[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch all published learning paths
  const { data: paths, error } = await supabase
    .from('ai_learning_paths')
    .select(`
      *,
      ai_learning_lessons(count)
    `)
    .eq('is_published', true)
    .order('order_index');

  if (error) {
    console.error('Error fetching learning paths:', error);
    return [];
  }

  // If user is logged in, get their progress
  if (user && paths) {
    const pathsWithProgress = await Promise.all(
      paths.map(async (path) => {
        const { data: progress, count: completedLessons } = await supabase
          .from('ai_learning_progress')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('learning_path_id', path.id)
          .eq('status', 'completed');

        const lessonsCount = path.ai_learning_lessons?.[0]?.count || 0;
        const completed = completedLessons || 0;
        const progressPercentage =
          lessonsCount > 0 ? (completed / lessonsCount) * 100 : 0;

        return {
          ...path,
          lessons_count: lessonsCount,
          completed_lessons: completed,
          progress_percentage: progressPercentage,
        };
      })
    );

    return pathsWithProgress;
  }

  return paths.map((path) => ({
    ...path,
    lessons_count: path.ai_learning_lessons?.[0]?.count || 0,
    completed_lessons: 0,
    progress_percentage: 0,
  }));
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'advanced':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export default async function LearningPathsPage() {
  const paths = await getLearningPaths();

  const stats = {
    total: paths.length,
    inProgress: paths.filter(
      (p) => (p.progress_percentage || 0) > 0 && (p.progress_percentage || 0) < 100
    ).length,
    completed: paths.filter((p) => (p.progress_percentage || 0) === 100).length,
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <Link
          href="/dashboard/ai-tools"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
          Back to AI Tools
        </Link>

        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Learning Paths</h1>
            <p className="text-slate-600">
              Structured courses to master AI-powered development
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="font-semibold text-blue-600">{stats.total}</span>
            <span className="ml-1 text-slate-500">Total Paths</span>
          </Badge>
          {stats.inProgress > 0 && (
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <span className="font-semibold text-yellow-600">{stats.inProgress}</span>
              <span className="ml-1 text-slate-500">In Progress</span>
            </Badge>
          )}
          {stats.completed > 0 && (
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <span className="font-semibold text-green-600">{stats.completed}</span>
              <span className="ml-1 text-slate-500">Completed</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg bg-blue-50 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">
              Adaptive Learning Experience
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Our learning paths adapt to your skill level, role, and tech stack. Each path
              includes interactive lessons, hands-on exercises, and real-world projects to
              solidify your AI tool mastery.
            </p>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      {stats.inProgress > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Continue Learning</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {paths
              .filter(
                (path) =>
                  (path.progress_percentage || 0) > 0 &&
                  (path.progress_percentage || 0) < 100
              )
              .map((path) => (
                <Card key={path.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                          {path.icon ? (
                            <span className="text-2xl">{path.icon}</span>
                          ) : (
                            <Code className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{path.title}</CardTitle>
                          <Badge
                            variant="outline"
                            className={`mt-2 ${getDifficultyColor(path.difficulty)}`}
                          >
                            {path.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-medium text-slate-900">
                          {path.completed_lessons || 0} / {path.lessons_count || 0} lessons
                        </span>
                      </div>
                      <Progress value={path.progress_percentage || 0} />
                    </div>
                    <Link href={`/dashboard/ai-tools/learn/${path.id}`}>
                      <Button className="w-full" size="sm">
                        Continue Learning
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* All Learning Paths */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">All Learning Paths</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => {
            const isCompleted = (path.progress_percentage || 0) === 100;
            const isStarted = (path.progress_percentage || 0) > 0;

            return (
              <Card
                key={path.id}
                className="group relative overflow-hidden hover:shadow-lg transition-all"
              >
                {isCompleted && (
                  <div className="absolute right-4 top-4 z-10">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      {path.icon ? (
                        <span className="text-2xl">{path.icon}</span>
                      ) : (
                        <Code className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{path.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">
                        {path.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(path.difficulty)}
                    >
                      {path.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="mr-1 h-3 w-3" />
                      {path.estimated_duration_hours}h
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {path.lessons_count || 0} lessons
                    </Badge>
                  </div>

                  {/* Target Roles */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-slate-600">For:</div>
                    <div className="flex flex-wrap gap-1">
                      {path.target_role.slice(0, 3).map((role) => (
                        <Badge key={role} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                      {path.target_role.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{path.target_role.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isStarted && !isCompleted && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Your Progress</span>
                        <span className="font-medium text-slate-900">
                          {Math.round(path.progress_percentage || 0)}%
                        </span>
                      </div>
                      <Progress value={path.progress_percentage || 0} className="h-1" />
                    </div>
                  )}

                  {/* Action Button */}
                  <Link href={`/dashboard/ai-tools/learn/${path.id}`}>
                    <Button
                      variant={isStarted ? 'default' : 'outline'}
                      className="w-full"
                      size="sm"
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Review Path
                        </>
                      ) : isStarted ? (
                        <>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <Circle className="mr-2 h-4 w-4" />
                          Start Path
                        </>
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {paths.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No Learning Paths Yet
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Learning paths are being prepared. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
