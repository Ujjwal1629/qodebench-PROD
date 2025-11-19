import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { InterviewPrepLevel, InterviewPrepTopic, InterviewPrepDifficulty } from '@/types/interview-prep';

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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get('level') as InterviewPrepLevel | null;
    const topic = searchParams.get('topic') as InterviewPrepTopic | null;
    const difficulty = searchParams.get('difficulty') as InterviewPrepDifficulty | null;
    const mode = searchParams.get('mode') || 'practice'; // 'flashcard' or 'practice'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;

    // Build query
    let query = supabase
      .from('interview_prep_questions')
      .select('*')
      .eq('is_active', true);

    // Apply filters
    if (level) {
      query = query.eq('level', level);
    }
    if (topic) {
      query = query.eq('topic', topic);
    }
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    // Limit results and order randomly for variety
    query = query.limit(limit);

    const { data: questions, error } = await query;

    if (error) {
      console.error('Error fetching interview prep questions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: 500 }
      );
    }

    // If flashcard mode, only return question and key_points
    if (mode === 'flashcard') {
      const flashcardData = questions?.map(q => ({
        id: q.id,
        question_text: q.question_text,
        key_points: q.key_points,
        difficulty: q.difficulty,
        topic: q.topic,
        level: q.level,
        tags: q.tags
      }));

      return NextResponse.json({ questions: flashcardData });
    }

    // Practice mode returns full questions including model_answer
    return NextResponse.json({ questions });

  } catch (error) {
    console.error('Error in interview prep questions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
