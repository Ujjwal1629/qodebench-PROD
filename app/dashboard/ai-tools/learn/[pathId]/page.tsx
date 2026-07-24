import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  Video,
  Code,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface PageProps {
  params: Promise<{
    pathId: string;
  }>;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  target_role: string[];
  tech_stack: string[];
  estimated_duration_hours: number;
  learning_objectives: string[];
  prerequisites: string[] | null;
  icon: string | null;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content_type: 'video' | 'article' | 'interactive' | 'quiz' | 'challenge';
  duration_minutes: number;
  order_index: number;
  learning_objectives: string[];
  status?: 'not_started' | 'in_progress' | 'completed';
  progress_percentage?: number;
}

async function getLearningPathWithLessons(pathId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch learning path
  const { data: path, error: pathError } = await supabase
    .from('ai_learning_paths')
    .select('*')
    .eq('id', pathId)
    .eq('is_published', true)
    .single();

  if (pathError || !path) {
    return null;
  }

  // Fetch lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from('ai_learning_lessons')
    .select('*')
    .eq('learning_path_id', pathId)
    .order('order_index');

  if (lessonsError) {
    return { path, lessons: [] };
  }

  // If user is logged in, get progress for each lesson
  if (user && lessons) {
    const lessonsWithProgress = await Promise.all(
      lessons.map(async (lesson) => {
        const { data: progress } = await supabase
          .from('ai_learning_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lesson.id)
          .single();

        return {
          ...lesson,
          status: progress?.status || 'not_started',
          progress_percentage: progress?.progress_percentage || 0,
        };
      })
    );

    return { path, lessons: lessonsWithProgress };
  }

  return { path, lessons };
}

function getContentTypeIcon(type: string) {
  switch (type) {
    case 'video':
      return Video;
    case 'article':
      return FileText;
    case 'interactive':
      return Code;
    case 'quiz':
      return HelpCircle;
    case 'challenge':
      return Code;
    default:
      return BookOpen;
  }
}

function getContentTypeColor(type: string) {
  switch (type) {
    case 'video':
      return 'bg-brand-100 text-brand-700';
    case 'article':
      return 'bg-blue-100 text-blue-700';
    case 'interactive':
      return 'bg-green-100 text-green-700';
    case 'quiz':
      return 'bg-yellow-100 text-yellow-700';
    case 'challenge':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pathId } = await params;
  const data = await getLearningPathWithLessons(pathId);

  if (!data) {
    return {
      title: 'Learning Path Not Found | QodeBench',
    };
  }

  return {
    title: `${data.path.title} | Learning Paths | QodeBench`,
    description: data.path.description,
  };
}

export default async function LearningPathDetailPage({ params }: PageProps) {
  const { pathId } = await params;
  const data = await getLearningPathWithLessons(pathId);

  if (!data) {
    notFound();
  }

  const { path, lessons } = data;

  // Calculate overall progress
  const completedLessons = lessons.filter((l) => l.status === 'completed').length;
  const totalLessons = lessons.length;
  const overallProgress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Find next lesson to start
  const nextLesson =
    lessons.find((l) => l.status === 'not_started' || l.status === 'in_progress') ||
    lessons[0];

  // Calculate total duration
  const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration_minutes, 0);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Link
        href="/dashboard/ai-tools/learn"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
        Back to Learning Paths
      </Link>

      {/* Path Header */}
      <div className="rounded-lg bg-slate-50 p-6 md:p-8">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {path.icon && (
                <div className="rounded-lg bg-white p-3 text-3xl shadow-sm">
                  {path.icon}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{path.title}</h1>
                <p className="mt-2 text-slate-700">{path.description}</p>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="text-sm">
              {path.difficulty}
            </Badge>
            <Badge variant="outline" className="bg-white text-sm">
              <Clock className="mr-1 h-3 w-3" />
              {totalDuration} minutes total
            </Badge>
            <Badge variant="outline" className="bg-white text-sm">
              {totalLessons} lessons
            </Badge>
          </div>

          {/* Progress Bar */}
          {overallProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">Your Progress</span>
                <span className="font-semibold text-slate-900">
                  {completedLessons} / {totalLessons} lessons completed
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          )}

          {/* CTA Button */}
          <div>
            <Link href={`/dashboard/ai-tools/learn/${pathId}/lesson/${nextLesson?.id}`}>
              <Button size="lg" className="mt-2">
                {overallProgress > 0 ? (
                  <>
                    Continue Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Learning Path
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Path Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {path.learning_objectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span className="text-slate-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          {path.prerequisites && path.prerequisites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {path.prerequisites.map((prereq: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Circle className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                      <span className="text-slate-700">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Target Roles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Best For</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-medium text-slate-700">Roles</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {path.target_role.map((role: string) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
                {path.tech_stack.length > 0 && (
                  <>
                    <Separator className="my-3" />
                    <div>
                      <div className="text-sm font-medium text-slate-700">Tech Stack</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {path.tech_stack.map((tech: string) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Lessons List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
              <CardDescription>
                {totalLessons} lessons • {totalDuration} minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-200">
                {lessons.map((lesson, index) => {
                  const Icon = getContentTypeIcon(lesson.content_type);
                  const isCompleted = lesson.status === 'completed';
                  const isInProgress = lesson.status === 'in_progress';

                  return (
                    <Link
                      key={lesson.id}
                      href={`/dashboard/ai-tools/learn/${pathId}/lesson/${lesson.id}`}
                      className="block transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-start gap-4 p-6">
                        {/* Lesson Number & Status */}
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                              isCompleted
                                ? 'bg-green-100 text-green-700'
                                : isInProgress
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          {index < lessons.length - 1 && (
                            <div className="h-full w-px bg-slate-200" />
                          )}
                        </div>

                        {/* Lesson Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">
                                {lesson.title}
                              </h3>
                              <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                                {lesson.description}
                              </p>
                            </div>
                            <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-slate-400" />
                          </div>

                          {/* Lesson Meta */}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getContentTypeColor(lesson.content_type)}`}
                            >
                              <Icon className="mr-1 h-3 w-3" />
                              {lesson.content_type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="mr-1 h-3 w-3" />
                              {lesson.duration_minutes} min
                            </Badge>
                            {isInProgress && lesson.progress_percentage && lesson.progress_percentage > 0 && (
                              <Badge variant="outline" className="text-xs text-blue-700">
                                {Math.round(lesson.progress_percentage)}% complete
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
