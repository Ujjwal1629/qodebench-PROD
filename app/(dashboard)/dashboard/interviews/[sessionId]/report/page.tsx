import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { InterviewReportClient } from '@/components/interviews/interview-report-client';
import { Skeleton } from '@/components/ui/skeleton';

interface PageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function InterviewReportPage({ params }: PageProps) {
  const { sessionId } = await params;
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  // Fetch interview session
  const { data: session, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single();

  if (error || !session) {
    redirect('/dashboard/interviews');
  }

  // Check if interview is completed
  if (session.status !== 'completed') {
    redirect(`/dashboard/interviews/${sessionId}`);
  }

  // Fetch all interview data
  const [mcqAnswers, voiceQAResponses, codingSubmissions, textQAResponses, discussionResponses] =
    await Promise.all([
      // MCQ Answers
      supabase
        .from('interview_mcq_answers')
        .select(`
          *,
          interview_mcq_questions (*)
        `)
        .eq('session_id', sessionId)
        .eq('is_draft', false),

      // Voice QA Responses
      supabase
        .from('interview_stage_responses')
        .select(`
          *,
          interview_voice_qa_questions (*)
        `)
        .eq('session_id', sessionId)
        .eq('stage', 'stage_2_voice_qa')
        .eq('is_draft', false),

      // Coding Submissions
      supabase
        .from('interview_coding_submissions')
        .select(`
          *,
          interview_coding_challenges (*)
        `)
        .eq('session_id', sessionId)
        .eq('is_draft', false),

      // Text QA Responses
      supabase
        .from('interview_stage_responses')
        .select(`
          *,
          interview_text_qa_questions (*)
        `)
        .eq('session_id', sessionId)
        .eq('stage', 'stage_4_text_qa')
        .eq('is_draft', false),

      // Discussion Responses
      supabase
        .from('interview_stage_responses')
        .select(`
          *,
          interview_discussion_questions (*)
        `)
        .eq('session_id', sessionId)
        .eq('stage', 'stage_5_discussion')
        .eq('is_draft', false),
    ]);

  const reportData = {
    session,
    mcqAnswers: mcqAnswers.data || [],
    voiceQAResponses: voiceQAResponses.data || [],
    codingSubmissions: codingSubmissions.data || [],
    textQAResponses: textQAResponses.data || [],
    discussionResponses: discussionResponses.data || [],
  };

  return (
    <Suspense fallback={<ReportSkeleton />}>
      <InterviewReportClient data={reportData} />
    </Suspense>
  );
}

function ReportSkeleton() {
  return (
    <div className="container max-w-6xl space-y-8 py-8">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
