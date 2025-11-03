import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, experienceLevel, language } = body;

    if (!sessionId || !experienceLevel || !language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('interview_sessions')
      .select('id, user_id')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Fetch a random coding challenge for the experience level and language
    const { data: challenges, error: challengeError } = await supabase
      .from('interview_coding_challenges')
      .select('*')
      .eq('experience_level', experienceLevel)
      .eq('language', language);

    if (challengeError || !challenges || challenges.length === 0) {
      return NextResponse.json(
        { error: 'No challenges found for this level and language' },
        { status: 404 }
      );
    }

    // Pick a random challenge
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomIndex];

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error('Error fetching coding challenge:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
