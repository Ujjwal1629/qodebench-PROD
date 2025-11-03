import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, experienceLevel } = await request.json();

    if (!sessionId || !experienceLevel) {
      return NextResponse.json(
        { error: 'Session ID and experience level are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify session belongs to authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: session } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Fetch 10 random MCQ questions for the experience level
    const { data: questions, error: questionsError } = await supabase
      .from('interview_mcq_questions')
      .select('id, question_text, option_a, option_b, option_c, option_d, category, difficulty_score')
      .eq('experience_level', experienceLevel)
      .eq('is_active', true)
      .limit(10);

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: 500 }
      );
    }

    // Shuffle the questions to randomize
    const shuffled = questions?.sort(() => Math.random() - 0.5) || [];

    return NextResponse.json({ questions: shuffled });
  } catch (error: any) {
    console.error('MCQ questions API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
