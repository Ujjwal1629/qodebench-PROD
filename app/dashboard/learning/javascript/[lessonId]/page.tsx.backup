import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProgressService } from '@/lib/learning/progress-service';
import { QuizService } from '@/lib/quiz/quiz-service';
import { SplitScreenLayout } from '@/components/learning/split-screen-layout';
import { ChatInterface } from '@/components/learning/chat/chat-interface';
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
          href="/dashboard/learning/javascript"
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
                  <Link href={`/dashboard/learning/javascript/${accessCheck.required_lesson.id}`}>
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

  const nextLessonUrl = nextLesson ? `/dashboard/learning/javascript/${nextLesson.id}` : null;

  // Theory Panel Component
  const TheoryPanel = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/dashboard/learning/javascript"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </Link>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">
            Lesson {lesson.order_index}
          </span>
          <span className="text-xs text-slate-500">
            {lesson.duration_minutes} min • {quizQuestions.length} questions
          </span>
        </div>
        <h1 className="text-3xl font-bold leading-tight text-slate-900">{lesson.title}</h1>
        <p className="text-base text-slate-600 leading-relaxed">{lesson.description}</p>
      </div>

      {/* Lesson Content (Markdown) */}
      <div className="prose prose-slate max-w-none
        prose-headings:font-bold prose-headings:text-slate-900
        prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-8
        prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6 prose-h2:text-sky-700
        prose-h3:text-lg prose-h3:mb-3 prose-h3:mt-5 prose-h3:text-sky-600
        prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-sky-600 prose-a:underline hover:prose-a:text-sky-700
        prose-strong:text-slate-900 prose-strong:font-semibold
        prose-ul:my-4 prose-ul:space-y-2
        prose-ol:my-4 prose-ol:space-y-2
        prose-li:text-slate-700 prose-li:leading-relaxed
        prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-slate-950 prose-pre:text-slate-50 prose-pre:my-5 prose-pre:p-0 prose-pre:rounded-lg prose-pre:shadow
        prose-blockquote:border-l-4 prose-blockquote:border-sky-500 prose-blockquote:bg-sky-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:my-4 prose-blockquote:not-italic prose-blockquote:text-sky-900">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="flex items-center gap-3 scroll-mt-20" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="flex items-center gap-2 scroll-mt-20" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="flex items-center gap-2 scroll-mt-20" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-base" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="space-y-2 list-disc pl-6" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="space-y-2 list-decimal pl-6" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="leading-relaxed" {...props} />
                ),
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="rounded-lg overflow-hidden my-5 border border-slate-700">
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          padding: '1.25rem',
                          fontSize: '0.875rem',
                          lineHeight: '1.6',
                          borderRadius: 0
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                blockquote: ({ node, ...props }) => (
                  <blockquote {...props} />
                ),
              }}
            >
              {lesson.content}
            </ReactMarkdown>
      </div>

      {/* Quiz Section */}
      {quizQuestions.length > 0 && (
        <div className="space-y-4 pt-6 mt-8 border-t border-slate-200">
          <div className="flex items-start gap-3">
            <div className="bg-sky-500 p-2 rounded-lg mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Test Your Knowledge</h2>
              <p className="text-sm text-slate-600 mt-1">
                Complete the quiz below. You can move to the next lesson anytime - scoring well just helps track your progress!
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
  );

  // Chat Panel Component
  const ChatPanel = () => (
    <ChatInterface
      lessonId={lessonId}
      lessonTitle={lesson.title}
      lessonContent={lesson.content}
    />
  );

  return (
    <div>
      <SplitScreenLayout leftPanel={<TheoryPanel />} rightPanel={<ChatPanel />} />
    </div>
  );
}
