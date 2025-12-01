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
    const { questionId, originalAnswer, followUpQuestion, followUpAnswer } = body;

    if (!questionId || !followUpQuestion || !followUpAnswer) {
      return NextResponse.json(
        { error: 'Question ID, follow-up question, and follow-up answer are required' },
        { status: 400 }
      );
    }

    // Fetch the question
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

    // Generate AI feedback for follow-up answer
    let feedback = '';

    if (process.env.OPENAI_API_KEY) {
      try {
        const systemPrompt = `You are a senior MERN-stack technical interviewer evaluating a candidate's follow-up answer.

Your task is to provide brief, constructive feedback (2-3 sentences) on their follow-up response.

Be conversational and interview-realistic. Focus on:
1. Whether they addressed the follow-up question adequately
2. Depth of understanding demonstrated
3. Any improvements or additional insights

Keep it concise and actionable. Do NOT use markdown formatting.`;

        const userPrompt = `Original Question: "${question.question_text}"

Candidate's Original Answer: "${originalAnswer}"

Follow-up Question: "${followUpQuestion}"

Candidate's Follow-up Answer: "${followUpAnswer}"

Provide feedback on the follow-up answer.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 300,
        });

        feedback = completion.choices[0]?.message?.content?.trim() || '';

      } catch (aiError) {
        console.error('OpenAI API error:', aiError);
        // Provide fallback feedback if AI fails
        feedback = 'Your follow-up answer has been recorded. Continue practicing to improve your understanding of this topic.';
      }
    } else {
      // No OpenAI key - provide generic feedback
      feedback = 'Your follow-up answer has been submitted. Keep practicing to strengthen your technical interview skills.';
    }

    // Save follow-up attempt to database (optional - you can extend the schema)
    // For now, we'll just return the feedback

    return NextResponse.json({
      success: true,
      feedback,
    });

  } catch (error) {
    console.error('Error in interview prep follow-up submit API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
