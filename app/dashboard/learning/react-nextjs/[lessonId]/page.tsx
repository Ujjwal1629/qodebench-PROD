import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProgressService } from '@/lib/learning/progress-service';
import { QuizService } from '@/lib/quiz/quiz-service';
import { SplitScreenLayout } from '@/components/learning/split-screen-layout';
import { AITutorDock } from '@/components/learning/ai-tutor-dock';
import { QuizComponent } from '@/components/learning/quiz/quiz-component';
import { ReadingProgress } from '@/components/learning/reading-progress';
import { EnhancedMarkdownRenderer } from '@/components/learning/enhanced-markdown-renderer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, BookOpen } from 'lucide-react';

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  // Get lesson details
  const { data: lesson } = await supabase
    .from('ai_learning_lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (!lesson) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardContent className="p-6">
            <p>Lesson not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // OPTIMIZED: Parallelize independent queries for faster loading
  const [accessCheck, quizQuestions, nextLesson] = await Promise.all([
    ProgressService.canAccessLesson(user.id, lessonId),
    QuizService.getQuestionsForLesson(lessonId),
    ProgressService.getNextLesson(user.id, lessonId),
  ]);

  if (!accessCheck.can_access) {
    return (
      <div className="container max-w-4xl py-10 space-y-4">
        <Link
          href="/dashboard/learning/react-nextjs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-sky-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lessons
        </Link>
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-4xl">🔒</div>
            <h2 className="text-2xl font-bold">Lesson Locked</h2>
            <p className="text-muted-foreground">{accessCheck.reason}</p>
            {accessCheck.required_lesson && (
              <div className="mt-4">
                <p className="text-sm mb-2">Complete this lesson first:</p>
                <Button asChild className="bg-sky-600 hover:bg-sky-700">
                  <Link href={`/dashboard/learning/react-nextjs/${accessCheck.required_lesson.id}`}>
                    Go to {accessCheck.required_lesson.title}
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mark lesson as started (non-blocking - fire and forget)
  ProgressService.markLessonAsStarted(user.id, lessonId);

  const nextLessonUrl = nextLesson ? `/dashboard/learning/react-nextjs/${nextLesson.id}` : null;

  // Theory Panel Component
  const TheoryPanel = () => (
    <div className="relative">
      {/* Reading Progress Bar */}
      <ReadingProgress />

      <div className="space-y-8">
        <Link
          href="/dashboard/learning/react-nextjs"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to React & Next.js
        </Link>

        {/* Lesson Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-100 px-3 py-1.5 rounded-full border border-sky-200">
              <BookOpen className="h-3.5 w-3.5" />
              Lesson {lesson.order_index}
            </span>
            <span className="text-sm text-slate-500">
              {lesson.duration_minutes} min read • {quizQuestions.length} quiz questions
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 tracking-tight">
            {lesson.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {lesson.description}
          </p>
        </div>

        {/* Divider */}
        <hr className="border-slate-200" />

        {/* Enhanced Markdown Content */}
        <EnhancedMarkdownRenderer content={lesson.content} className="prose-enhanced" />

        {/* Quiz Section */}
        {quizQuestions.length > 0 && (
          <div className="mt-16 bg-gradient-to-br from-sky-50 via-white to-purple-50 rounded-3xl p-8 space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-sky-500 to-purple-600 p-4 rounded-2xl shadow-lg mb-6">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Ready to Test Your Knowledge?
                </h2>
                <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  Complete the quiz to reinforce what you have learned. You can move to the next lesson
                  anytime - scoring well helps track your progress and mastery!
                </p>
              </div>
            </div>
            <QuizComponent
              lessonId={lessonId}
              questions={quizQuestions}
              nextLessonUrl={nextLessonUrl}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <SplitScreenLayout leftPanel={<TheoryPanel />} />
      <AITutorDock
        lessonId={lessonId}
        lessonTitle={lesson.title}
        lessonContent={lesson.content}
      />
    </>
  );
}
