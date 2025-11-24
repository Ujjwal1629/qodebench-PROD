import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import InterviewOrchestrator from '@/components/interviews/interview-orchestrator';
import { Loader2 } from 'lucide-react';

interface PageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function InterviewStagesPage({ params }: PageProps) {
  const { sessionId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  // Verify session exists
  const { data: session } = await supabase
    .from('interview_sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single();

  if (!session) {
    redirect('/dashboard/interviews');
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg font-medium">Loading interview...</p>
          </div>
        </div>
      }
    >
      <InterviewOrchestrator sessionId={sessionId} />
    </Suspense>
  );
}
