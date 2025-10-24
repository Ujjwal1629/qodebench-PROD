import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import InterviewHub from '@/components/interviews/interview-hub';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Mock Interviews | QodeBench',
  description: 'Practice technical interviews with AI-powered feedback',
};

export default async function InterviewsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI-Powered Mock Interviews</h1>
        <p className="text-muted-foreground text-lg">
          Practice with voice-interactive AI interviewer. Get real-time hints and comprehensive feedback.
        </p>
      </div>

      <Suspense fallback={<InterviewHubSkeleton />}>
        <InterviewHub userId={user.id} />
      </Suspense>
    </div>
  );
}

function InterviewHubSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
