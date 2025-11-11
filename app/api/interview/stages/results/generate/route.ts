import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';

interface StageScore {
  stage: string;
  title: string;
  score: number;
  maxScore: number;
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY CHECK: Verify user has access to interview prep
    const { user, error: accessError } = await verifyInterviewAPIAccess();
    if (accessError) return accessError;

    const supabase = await createClient();

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      );
    }

    // Fetch session with all scores
    const { data: session, error: sessionError } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Fetch all stage responses with feedback
    const { data: responses, error: responsesError } = await supabase
      .from('interview_stage_responses')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
    }

    // Prepare stage scores
    // Use stage_1, stage_2, etc as keys (matching database)
    const stageScores: StageScore[] = [
      {
        stage: 'stage_1_mcq',
        title: 'MCQ Assessment',
        score: session.stage_scores?.stage_1 || 0,
        maxScore: 10,
      },
      {
        stage: 'stage_2_voice_qa',
        title: 'Behavioral Q&A',
        score: session.stage_scores?.stage_2 || 0,
        maxScore: 10,
      },
      {
        stage: 'stage_3_coding',
        title: 'Live Coding',
        score: session.stage_scores?.stage_3 || 0,
        maxScore: 10,
      },
      {
        stage: 'stage_4_text_qa',
        title: 'Technical Concepts',
        score: session.stage_scores?.stage_4 || 0,
        maxScore: 10,
      },
      {
        stage: 'stage_5_discussion',
        title: 'System Design',
        score: session.stage_scores?.stage_5 || 0,
        maxScore: 10,
      },
    ];

    // Calculate overall score
    const totalScore = stageScores.reduce((sum, stage) => sum + stage.score, 0);
    const overallScore = totalScore / stageScores.length;

    // Determine performance level
    let performanceLevel = 'average';
    if (overallScore >= 8) performanceLevel = 'excellent';
    else if (overallScore >= 6) performanceLevel = 'good';
    else if (overallScore < 4) performanceLevel = 'needs-improvement';

    // Aggregate strengths and improvements
    const allStrengths: string[] = [];
    const allImprovements: string[] = [];

    // Organize detailed feedback by stage
    const detailedFeedback = [];

    for (const stageScore of stageScores) {
      const stageResponses = responses?.filter((r) => r.stage === stageScore.stage) || [];

      if (stageResponses.length > 0) {
        const stageData = {
          stage: stageScore.title,
          responses: stageResponses.map((r) => {
            // Add strengths and improvements to aggregate lists
            if (r.evaluation_feedback?.strengths) {
              allStrengths.push(...r.evaluation_feedback.strengths);
            }
            if (r.evaluation_feedback?.improvements) {
              allImprovements.push(...r.evaluation_feedback.improvements);
            }

            return {
              question_text:
                r.question_text ||
                `Question ${stageResponses.indexOf(r) + 1}`,
              score: r.evaluation_score || 0,
              feedback: {
                strengths: r.evaluation_feedback?.strengths || [],
                improvements: r.evaluation_feedback?.improvements || [],
              },
            };
          }),
        };

        detailedFeedback.push(stageData);
      }
    }

    // Add stage-specific insights based on scores
    if (stageScores[0].score >= 8) {
      allStrengths.push('Strong foundational knowledge demonstrated in MCQ assessment');
    } else if (stageScores[0].score < 5) {
      allImprovements.push('Review core concepts tested in MCQ assessment');
    }

    if (stageScores[1].score >= 7) {
      allStrengths.push('Excellent communication and behavioral response skills');
    }

    if (stageScores[2].score >= 7) {
      allStrengths.push('Strong coding skills and problem-solving ability');
    } else if (stageScores[2].score < 6) {
      allImprovements.push('Practice more coding challenges to improve problem-solving speed');
    }

    if (stageScores[3].score >= 7) {
      allStrengths.push('Solid understanding of technical concepts');
    }

    if (stageScores[4].score >= 7) {
      allStrengths.push('Good system design and architectural thinking');
    } else if (stageScores[4].score < 6) {
      allImprovements.push('Study system design patterns and scalability principles');
    }

    // Deduplicate and limit to top 5 for each
    const uniqueStrengths = [...new Set(allStrengths)].slice(0, 5);
    const uniqueImprovements = [...new Set(allImprovements)].slice(0, 5);

    // Add overall insights if lists are empty
    if (uniqueStrengths.length === 0) {
      uniqueStrengths.push('Completed all stages of the interview');
    }

    if (uniqueImprovements.length === 0) {
      uniqueImprovements.push('Continue practicing to improve further');
    }

    // Build the report
    const report = {
      overall_score: Math.round(overallScore * 10) / 10,
      stage_scores: stageScores,
      strengths: uniqueStrengths,
      improvements: uniqueImprovements,
      detailed_feedback: detailedFeedback,
      performance_level: performanceLevel,
    };

    // Update session with final report
    await supabase
      .from('interview_sessions')
      .update({
        final_report: report,
      })
      .eq('id', sessionId);

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
