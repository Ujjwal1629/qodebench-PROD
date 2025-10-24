'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface LessonContentProps {
  lesson: {
    id: string;
    title: string;
    content: string;
    content_type: string;
  };
  progress: {
    status: string;
    progress_percentage: number;
  } | null;
  pathId: string;
  lessonId: string;
}

export function LessonContent({ lesson, progress, pathId, lessonId }: LessonContentProps) {
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleMarkComplete = async () => {
    setIsMarkingComplete(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to sign in
        router.push('/signin');
        return;
      }

      // Update or insert progress
      const { error } = await supabase.from('ai_learning_progress').upsert(
        {
          user_id: user.id,
          learning_path_id: pathId,
          lesson_id: lessonId,
          status: 'completed',
          progress_percentage: 100,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,lesson_id',
        }
      );

      if (error) {
        console.error('Error marking lesson complete:', error);
        return;
      }

      // Refresh the page to show updated status
      router.refresh();
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const isCompleted = progress?.status === 'completed';

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <Card>
        <CardContent className="prose prose-slate max-w-none pt-6">
          {lesson.content_type === 'video' ? (
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-lg bg-slate-100 flex items-center justify-center">
                <p className="text-slate-500">Video player placeholder</p>
              </div>
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>
          ) : lesson.content_type === 'interactive' ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-6">
                <p className="text-slate-600">Interactive content will be displayed here</p>
              </div>
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>
          ) : lesson.content_type === 'quiz' ? (
            <div className="space-y-4">
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
              <div className="rounded-lg bg-blue-50 p-6">
                <p className="text-sm text-blue-900">
                  Quiz functionality coming soon. For now, review the content above.
                </p>
              </div>
            </div>
          ) : (
            // Article or Challenge
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          )}
        </CardContent>
      </Card>

      {/* Mark Complete Button */}
      {!isCompleted && (
        <Card className="bg-green-50">
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <h3 className="font-semibold text-slate-900">Ready to move on?</h3>
              <p className="text-sm text-slate-600">
                Mark this lesson as complete to track your progress
              </p>
            </div>
            <Button
              onClick={handleMarkComplete}
              disabled={isMarkingComplete}
              className="bg-green-600 hover:bg-green-700"
            >
              {isMarkingComplete ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Complete
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
