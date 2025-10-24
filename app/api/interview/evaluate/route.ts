import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';

interface EvaluationResult {
  quality_score: number; // 0-10
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  follow_up_question?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Initialize OpenAI client only when needed
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    const { responseId, sessionId } = await request.json();

    if (!responseId) {
      return NextResponse.json({ error: 'Response ID required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get response and question details
    const { data: response, error: responseError } = await supabase
      .from('interview_responses')
      .select('*, interview_questions(*)')
      .eq('id', responseId)
      .single();

    if (responseError || !response) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 });
    }

    const question = response.interview_questions;

    // Build evaluation prompt based on question type
    const evaluationPrompt = buildEvaluationPrompt(question, response.user_answer);

    // Call GPT-4 for evaluation
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert technical interviewer evaluating candidate responses.
Provide structured, constructive feedback with:
1. A quality score from 0-10 (10 being excellent)
2. 2-3 key strengths
3. 2-3 areas for improvement
4. 2-3 actionable suggestions
5. An optional follow-up question if appropriate

Be fair but rigorous. Consider: clarity, completeness, technical accuracy, communication skills, and problem-solving approach.

Respond in JSON format:
{
  "quality_score": number,
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[],
  "follow_up_question": string | null
}`,
        },
        {
          role: 'user',
          content: evaluationPrompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const evaluation: EvaluationResult = JSON.parse(
      completion.choices[0].message.content || '{}'
    );

    // Apply hint penalty (5% per hint)
    const hintPenalty = response.hints_used * 0.05;
    const adjustedScore = Math.max(0, evaluation.quality_score * (1 - hintPenalty));

    // Update response with evaluation
    await supabase
      .from('interview_responses')
      .update({
        quality_score: adjustedScore,
        ai_evaluation: evaluation,
      })
      .eq('id', responseId);

    return NextResponse.json({
      ...evaluation,
      quality_score: adjustedScore,
      original_score: evaluation.quality_score,
      hint_penalty: hintPenalty,
    });
  } catch (error: any) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}

function buildEvaluationPrompt(question: any, userAnswer: string): string {
  const { interview_type, question_text, context, expected_approach, sample_answer } = question;

  let prompt = `Interview Type: ${interview_type.toUpperCase()}\n\n`;
  prompt += `Question: ${question_text}\n\n`;

  if (context) {
    prompt += `Context: ${context}\n\n`;
  }

  if (expected_approach) {
    prompt += `Expected Approach: ${expected_approach}\n\n`;
  }

  if (sample_answer) {
    prompt += `Sample Good Answer: ${sample_answer}\n\n`;
  }

  prompt += `Candidate's Answer:\n${userAnswer}\n\n`;

  // Add type-specific evaluation criteria
  switch (interview_type) {
    case 'behavioral':
      prompt += `Evaluate using STAR method criteria:
- Situation: Did they set context clearly?
- Task: Did they explain their responsibility?
- Action: Did they describe specific actions taken?
- Result: Did they share measurable outcomes?

Also consider: authenticity, leadership, problem-solving, communication clarity.`;
      break;

    case 'technical':
      prompt += `Evaluate technical accuracy:
- Correctness of solution
- Time & space complexity analysis
- Edge case handling
- Code quality and clarity
- Explanation of thought process

Consider alternative solutions and optimizations.`;
      break;

    case 'system_design':
      prompt += `Evaluate system design thinking:
- Requirements gathering and clarification
- High-level architecture
- Data model and storage choices
- Scalability and performance considerations
- Trade-offs and alternatives discussed
- Communication and diagramming`;
      break;

    case 'frontend':
      prompt += `Evaluate frontend expertise:
- Technical accuracy of concepts
- Understanding of React/JavaScript fundamentals
- Performance and optimization awareness
- Best practices and patterns
- Practical application
- Clear explanation`;
      break;
  }

  return prompt;
}
