import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ProgressStats, InterviewPrepTopic, InterviewPrepLevel, InterviewPrepDifficulty } from '@/types/interview-prep';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all user attempts with question details
    const { data: attempts, error: attemptsError } = await supabase
      .from('interview_prep_attempts')
      .select(`
        *,
        interview_prep_questions (
          topic,
          level,
          difficulty
        )
      `)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (attemptsError) {
      console.error('Error fetching attempts:', attemptsError);
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      );
    }

    // Calculate statistics
    const totalAttempted = attempts?.length || 0;
    const totalTimeSpent = attempts?.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0) || 0;
    const averageTimePerQuestion = totalAttempted > 0 ? Math.round(totalTimeSpent / totalAttempted) : 0;

    // Group by topic
    const byTopic: Record<string, number> = {};
    const byLevel: Record<string, number> = {};
    const byDifficulty: Record<string, number> = {};

    attempts?.forEach(attempt => {
      const question = attempt.interview_prep_questions;
      if (question) {
        byTopic[question.topic] = (byTopic[question.topic] || 0) + 1;
        byLevel[question.level] = (byLevel[question.level] || 0) + 1;
        byDifficulty[question.difficulty] = (byDifficulty[question.difficulty] || 0) + 1;
      }
    });

    const stats: ProgressStats = {
      totalAttempted,
      byTopic: byTopic as Record<InterviewPrepTopic, number>,
      byLevel: byLevel as Record<InterviewPrepLevel, number>,
      byDifficulty: byDifficulty as Record<InterviewPrepDifficulty, number>,
      totalTimeSpent,
      averageTimePerQuestion,
    };

    // Get total questions per topic for progress calculation
    const { data: allQuestions, error: questionsError } = await supabase
      .from('interview_prep_questions')
      .select('topic, level')
      .eq('is_active', true);

    if (questionsError) {
      console.error('Error fetching total questions:', questionsError);
    }

    // Calculate topic progress
    const topicProgress: Record<string, { total: number; attempted: number; percentage: number; fresherTotal: number; experiencedTotal: number }> = {};

    const topics: InterviewPrepTopic[] = ['javascript', 'react', 'node', 'mongodb', 'fullstack', 'system-design'];

    topics.forEach(topic => {
      const total = allQuestions?.filter(q => q.topic === topic).length || 0;
      const fresherTotal = allQuestions?.filter(q => q.topic === topic && q.level === 'fresher').length || 0;
      const experiencedTotal = allQuestions?.filter(q => q.topic === topic && q.level === 'experienced').length || 0;
      const attempted = byTopic[topic] || 0;
      const percentage = total > 0 ? Math.round((attempted / total) * 100) : 0;

      topicProgress[topic] = { total, attempted, percentage, fresherTotal, experiencedTotal };
    });

    // Calculate total questions count
    const totalQuestions = allQuestions?.length || 0;
    const totalFresherQuestions = allQuestions?.filter(q => q.level === 'fresher').length || 0;
    const totalExperiencedQuestions = allQuestions?.filter(q => q.level === 'experienced').length || 0;

    // Get recent attempts (limit to 10)
    const recentAttempts = attempts?.slice(0, 10) || [];

    return NextResponse.json({
      stats,
      recentAttempts,
      topicProgress,
      totalQuestions,
      totalFresherQuestions,
      totalExperiencedQuestions,
    });

  } catch (error) {
    console.error('Error in interview prep progress API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
