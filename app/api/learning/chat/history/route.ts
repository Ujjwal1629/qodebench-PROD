import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
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

    // Get lesson_id from query params
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lesson_id');

    if (!lessonId) {
      return NextResponse.json({ error: 'lesson_id is required' }, { status: 400 });
    }

    // Fetch chat history
    const { data, error } = await supabase
      .from('html_css_chat_history')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: true })
      .limit(50); // Limit to last 50 messages

    if (error) {
      throw new Error(`Failed to fetch chat history: ${error.message}`);
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}
