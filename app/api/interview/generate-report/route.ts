import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { verifyInterviewAPIAccess } from '@/lib/utils/api-access-checks';

interface InterviewReport {
  overall_summary: string;
  strengths: string[];
  areas_for_improvement: string[];
  detailed_feedback_by_question: Array<{
    question: string;
    answer_quality: string;
    key_points: string[];
  }>;
  improvement_roadmap: Array<{
    skill: string;
    priority: 'high' | 'medium' | 'low';
    recommended_actions: string[];
  }>;
  score_breakdown: {
    overall: number;
    communication: number;
    technical: number;
    problem_solving: number;
  };
  next_steps: string[];
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY CHECK: Verify user has access to interview prep
    const { user, error: accessError } = await verifyInterviewAPIAccess();
    if (accessError) return accessError;

    // Initialize OpenAI client only when needed
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get session with all responses and questions
    const { data: session } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    const { data: responses } = await supabase
      .from('interview_responses')
      .select('*, interview_questions(*)')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (!session || !responses || responses.length === 0) {
      return NextResponse.json({ error: 'Session data not found' }, { status: 404 });
    }

    // Build comprehensive analysis prompt
    const analysisPrompt = buildReportPrompt(session, responses);

    // Call GPT-4 for comprehensive analysis
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a senior technical interviewer providing comprehensive post-interview feedback.

Your analysis should be:
- Constructive and actionable
- Specific with examples
- Balanced (strengths AND growth areas)
- Forward-looking with clear next steps
- Professional but encouraging

Provide a detailed report in JSON format with:
1. overall_summary: 2-3 paragraph assessment
2. strengths: 3-5 key strengths demonstrated
3. areas_for_improvement: 3-5 specific areas to work on
4. detailed_feedback_by_question: analysis of each answer
5. improvement_roadmap: prioritized skills with action items
6. score_breakdown: scores with justification
7. next_steps: 3-5 recommended actions

Be honest but supportive. The goal is to help the candidate improve.`,
        },
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
      temperature: 0.4,
      response_format: { type: 'json_object' },
      max_tokens: 3000,
    });

    const report: InterviewReport = JSON.parse(
      completion.choices[0].message.content || '{}'
    );

    // Calculate final scores
    const avgResponseScore =
      responses.reduce((sum, r) => sum + (r.quality_score || 0), 0) / responses.length;

    const hintPenalty = session.hints_used * 0.05;
    const timeBonus = session.duration_seconds && session.duration_seconds < 1800 ? 0.5 : 0; // Bonus for completing under 30 min

    const finalScore = Math.min(10, Math.max(0, avgResponseScore * (1 - hintPenalty) + timeBonus));

    // Score breakdown (with some variance based on interview type)
    const scoreBreakdown = {
      overall: finalScore,
      communication: report.score_breakdown?.communication || finalScore * 0.95,
      technical: report.score_breakdown?.technical || finalScore * 1.05,
      problem_solving: report.score_breakdown?.problem_solving || finalScore,
    };

    // Update session with AI feedback and final scores
    await supabase
      .from('interview_sessions')
      .update({
        ai_feedback: report,
        overall_score: scoreBreakdown.overall,
        communication_score: scoreBreakdown.communication,
        technical_score: scoreBreakdown.technical,
        problem_solving_score: scoreBreakdown.problem_solving,
      })
      .eq('id', sessionId);

    return NextResponse.json({
      report,
      scoreBreakdown,
      metadata: {
        questions_answered: responses.length,
        hints_used: session.hints_used,
        duration_seconds: session.duration_seconds,
        hint_penalty: hintPenalty,
        time_bonus: timeBonus,
      },
    });
  } catch (error: any) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}

function buildReportPrompt(session: any, responses: any[]): string {
  let prompt = `Interview Session Analysis\n\n`;
  prompt += `Type: ${session.interview_type}\n`;
  prompt += `Company Focus: ${session.company}\n`;
  prompt += `Difficulty: ${session.difficulty}\n`;
  prompt += `Duration: ${Math.round((session.duration_seconds || 0) / 60)} minutes\n`;
  prompt += `Questions Answered: ${responses.length}\n`;
  prompt += `Hints Used: ${session.hints_used}\n\n`;

  prompt += `DETAILED RESPONSES:\n\n`;

  responses.forEach((response, index) => {
    const question = response.interview_questions;
    prompt += `--- Question ${index + 1} ---\n`;
    prompt += `Q: ${question.question_text}\n`;
    prompt += `Category: ${question.category}\n`;
    prompt += `Difficulty: ${question.difficulty}\n\n`;
    prompt += `Candidate's Answer:\n${response.user_answer}\n\n`;

    if (response.ai_evaluation) {
      const eval_ = response.ai_evaluation;
      prompt += `Previous Evaluation:\n`;
      prompt += `Score: ${response.quality_score}/10\n`;
      prompt += `Strengths: ${eval_.strengths?.join(', ')}\n`;
      prompt += `Weaknesses: ${eval_.weaknesses?.join(', ')}\n\n`;
    }

    prompt += `Response Time: ${Math.round(response.response_time_seconds / 60)} minutes\n`;
    prompt += `Hints Used: ${response.hints_used}\n\n`;
  });

  prompt += `\nBased on this complete interview, provide comprehensive analysis and actionable feedback.`;

  return prompt;
}
