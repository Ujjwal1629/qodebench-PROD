import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import InterviewReport from '@/components/interviews/interview-report';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Interview Report | QodeBench',
  description: 'Your comprehensive interview feedback and analysis',
};

export default async function InterviewReportPage({
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

  // Get session with responses
  const { data: session, error: sessionError } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (sessionError || !session) {
    notFound();
  }

  // If not completed, redirect to session
  if (session.status === 'in_progress') {
    redirect(`/dashboard/interviews/${id}`);
  }

  // Get all responses with questions
  const { data: responses } = await supabase
    .from('interview_responses')
    .select('*, interview_questions(*)')
    .eq('session_id', id)
    .order('created_at', { ascending: true });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Suspense fallback={<ReportSkeleton />}>
        <InterviewReport session={session} responses={responses || []} />
      </Suspense>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-16 mb-6" />
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}
