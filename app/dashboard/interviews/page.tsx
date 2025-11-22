import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { InterviewCategoryCards } from '@/components/interviews/interview-category-cards';
import { Code2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Interviews | QodeBench',
  description: 'Practice MERN Stack questions and simulate full-stack interviews',
};

async function getInterviewPrepProgress(userId: string) {
  try {
    const supabase = await createClient();

    // Fetch all user attempts
    const { data: attempts } = await supabase
      .from('interview_prep_attempts')
      .select('id')
      .eq('user_id', userId);

    // Get total active questions
    const { data: questions } = await supabase
      .from('interview_prep_questions')
      .select('id')
      .eq('is_active', true);

    const totalQuestions = questions?.length || 40;
    const attemptedQuestions = attempts?.length || 0;
    const percentage = totalQuestions > 0 ? Math.round((attemptedQuestions / totalQuestions) * 100) : 0;

    return {
      totalQuestions,
      attemptedQuestions,
      percentage,
    };
  } catch (error) {
    console.error('Error fetching interview prep progress:', error);
    return {
      totalQuestions: 40,
      attemptedQuestions: 0,
      percentage: 0,
    };
  }
}

async function getMockInterviewProgress(userId: string) {
  try {
    const supabase = await createClient();

    // Get completed mock interviews count
    const { data: interviews } = await supabase
      .from('mock_interviews')
      .select('id')
      .eq('user_id', userId)
      .not('completed_at', 'is', null);

    const completedInterviews = interviews?.length || 0;

    return { completedInterviews };
  } catch (error) {
    console.error('Error fetching mock interview progress:', error);
    return { completedInterviews: 0 };
  }
}

export default async function InterviewsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  // Fetch progress data for both categories
  const [interviewPrepProgress, mockInterviewProgress] = await Promise.all([
    getInterviewPrepProgress(user.id),
    getMockInterviewProgress(user.id),
  ]);

  const totalAttempted = interviewPrepProgress.attemptedQuestions + mockInterviewProgress.completedInterviews;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-lg bg-blue-100 p-1.5 sm:p-2">
            <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Interviews</h1>
            <p className="text-sm sm:text-base text-slate-600">
              Practice technical questions and simulate real-world interviews
            </p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="font-semibold text-green-600">{totalAttempted}</span>
            <span className="ml-1 text-slate-500">Total Attempted</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="text-slate-600">2 Categories Available</span>
          </Badge>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 sm:p-5 md:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
          🎯 Choose Your Interview Path
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Practice MERN Stack questions with our <strong>Interview Prep</strong> mode (100% free), or
          experience realistic interviews with our <strong>6-Stage Mock Interview Simulator</strong> (Premium).
          Both paths will sharpen your technical skills and boost your confidence.
        </p>
      </div>

      {/* Interview Category Cards */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Interview Categories</h2>

        <InterviewCategoryCards
          interviewPrepProgress={interviewPrepProgress}
          mockInterviewProgress={mockInterviewProgress}
        />
      </div>
    </div>
  );
}
