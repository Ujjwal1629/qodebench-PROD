import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProgressService } from '@/lib/learning/progress-service';
import { QuizService } from '@/lib/quiz/quiz-service';
import { SplitScreenLayout } from '@/components/learning/split-screen-layout';
import { QuizComponent } from '@/components/learning/quiz/quiz-component';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

  // Parallelize independent queries for faster loading
  const [accessCheck, quizQuestions, nextLesson] = await Promise.all([
    ProgressService.canAccessLesson(user.id, lessonId),
    QuizService.getQuestionsForLesson(lessonId),
    ProgressService.getNextLesson(user.id, lessonId),
  ]);

  if (!accessCheck.can_access) {
    return (
      <div className="container max-w-4xl py-10 space-y-4">
        <Link
          href="/dashboard/learning/office-fundamentals"
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
                  <Link href={`/dashboard/learning/office-fundamentals/${accessCheck.required_lesson.id}`}>
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

  const nextLessonUrl = nextLesson ? `/dashboard/learning/office-fundamentals/${nextLesson.id}` : null;

  // Theory Panel Component
  const TheoryPanel = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/dashboard/learning/office-fundamentals"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to All Lessons
      </Link>

      <div className="space-y-3">
        <Badge variant="secondary" className="text-xs">
          Lesson {lesson.order_index}
        </Badge>
        <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
        <p className="text-lg text-slate-600">{lesson.description}</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {lesson.learning_objectives.map((obj: string, idx: number) => (
            <Badge key={idx} variant="outline" className="text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {obj}
            </Badge>
          ))}
        </div>
      </div>

      <div className="prose prose-slate max-w-none">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </div>

      {lesson.resources && lesson.resources.external_links && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-2">📚 Additional Resources</h3>
            <ul className="space-y-1">
              {lesson.resources.external_links.map((link: string, idx: number) => (
                <li key={idx}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Quiz Panel Component
  const QuizPanel = () => (
    <div className="h-full flex flex-col">
      <QuizComponent
        lessonId={lessonId}
        userId={user.id}
        questions={quizQuestions}
        nextLessonUrl={nextLessonUrl}
        backUrl="/dashboard/learning/office-fundamentals"
      />
    </div>
  );

  return (
    <SplitScreenLayout
      leftPanel={<TheoryPanel />}
      rightPanel={<QuizPanel />}
      leftTitle="Theory"
      rightTitle="Quiz"
    />
  );
}
