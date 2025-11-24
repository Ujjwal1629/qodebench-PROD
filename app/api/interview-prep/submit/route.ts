import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
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

    // Get request body
    const body = await request.json();
    const { questionId, userAnswer, timeSpentSeconds } = body;

    if (!questionId || !userAnswer) {
      return NextResponse.json(
        { error: 'Question ID and user answer are required' },
        { status: 400 }
      );
    }

    // Fetch the question with model answer
    const { data: question, error: questionError } = await supabase
      .from('interview_prep_questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (questionError || !question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Generate AI feedback using OpenAI
    let aiFeedback = '';
    let followUpQuestion = '';

    if (process.env.OPENAI_API_KEY) {
      try {
        const systemPrompt = `You are a senior MERN-stack technical interviewer providing feedback to a candidate.

Your task is to evaluate their answer and provide:
1. Brief constructive feedback (2-3 sentences) - what they did well and what's missing
2. One natural follow-up question to deepen the discussion

Be conversational and interview-realistic. Focus on practical understanding, not just theory.
Keep it concise and actionable. Do NOT use markdown formatting.`;

        const userPrompt = `Interview Question: "${question.question_text}"

Model Answer: ${question.model_answer}

Candidate's Answer: "${userAnswer}"

Provide feedback and a follow-up question.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        const response = completion.choices[0]?.message?.content || '';

        // Parse response - expect two parts separated by double newline
        const parts = response.split('\n\n');
        if (parts.length >= 2) {
          aiFeedback = parts[0].trim();
          followUpQuestion = parts.slice(1).join('\n\n').trim();
        } else {
          aiFeedback = response.trim();
          followUpQuestion = 'Can you explain how you would apply this concept in a real-world project?';
        }

      } catch (aiError) {
        console.error('OpenAI API error:', aiError);
        // Provide fallback feedback if AI fails
        aiFeedback = 'Your answer has been submitted. Review the model answer below to compare your response.';
        followUpQuestion = 'How would you implement this in a production environment?';
      }
    } else {
      // No OpenAI key - provide generic feedback
      aiFeedback = 'Your answer has been submitted. Review the model answer below to see how your response compares.';
      followUpQuestion = 'Can you elaborate on the practical applications of this concept?';
    }

    // Save attempt to database
    const { data: attempt, error: attemptError } = await supabase
      .from('interview_prep_attempts')
      .insert({
        user_id: user.id,
        question_id: questionId,
        user_answer: userAnswer,
        ai_feedback: aiFeedback,
        follow_up_question: followUpQuestion,
        time_spent_seconds: timeSpentSeconds || 0,
      })
      .select()
      .single();

    if (attemptError) {
      console.error('Error saving attempt:', attemptError);
      return NextResponse.json(
        { error: 'Failed to save attempt' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      ai_feedback: aiFeedback,
      follow_up_question: followUpQuestion,
      model_answer: question.model_answer,
    });

  } catch (error) {
    console.error('Error in interview prep submit API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
