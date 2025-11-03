import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import InterviewHubNew from '@/components/interviews/interview-hub-new';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Full-Stack Interview Simulator | QodeBench',
  description: '6-Stage interview process with AI-powered evaluation and professional report',
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
    <Suspense fallback={<InterviewHubSkeleton />}>
      <InterviewHubNew userId={user.id} />
    </Suspense>
  );
}

function InterviewHubSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
