import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import InterviewSession from '@/components/interviews/interview-session';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Interview Session | QodeBench',
  description: 'Active AI interview session',
};

export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  // Verify session exists and belongs to user
  const { data: session, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !session) {
    notFound();
  }

  // If already completed, redirect to report
  if (session.status === 'completed') {
    redirect(`/dashboard/interviews/${id}/report`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense fallback={<InterviewSessionSkeleton />}>
        <InterviewSession sessionId={id} initialSession={session} />
      </Suspense>
    </div>
  );
}

function InterviewSessionSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-16 mb-4" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-96" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  );
}
