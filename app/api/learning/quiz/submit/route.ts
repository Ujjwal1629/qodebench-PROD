import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { QuizService } from '@/lib/quiz/quiz-service';
import { QuizSubmissionRequest } from '@/types/learning';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = (await request.json()) as QuizSubmissionRequest;

    // Validate request
    if (!body.lesson_id || !body.answers || body.answers.length === 0) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Submit quiz and get results
    const results = await QuizService.submitQuiz(user.id, body);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
