import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, experienceLevel } = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch 3 random Voice Q&A questions
    const { data: questions, error } = await supabase
      .from('interview_voice_qa_questions')
      .select('id, question_text, question_type, expected_points')
      .eq('experience_level', experienceLevel)
      .eq('is_active', true)
      .limit(5);

    if (error) {
      console.error('Error fetching voice QA questions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: 500 }
      );
    }

    // Shuffle and take 3
    const shuffled = questions?.sort(() => Math.random() - 0.5).slice(0, 3) || [];

    return NextResponse.json({ questions: shuffled });
  } catch (error: any) {
    console.error('Voice QA questions API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
