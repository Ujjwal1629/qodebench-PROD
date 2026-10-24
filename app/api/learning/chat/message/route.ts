import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { ChatRequest } from '@/types/learning';
import { getChatTableForLesson } from '@/lib/learning/get-chat-table';
import { SYSTEM_PROMPTS } from '@/lib/learning/chat-prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

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
    const body = (await request.json()) as ChatRequest;

    // Validate request
    if (!body.lesson_id || !body.message || !body.mode) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Get the correct chat table for this lesson's module
    const chatTable = await getChatTableForLesson(body.lesson_id);
    if (!chatTable) {
      return NextResponse.json(
        { error: 'Could not determine learning module for this lesson' },
        { status: 400 }
      );
    }

    // Build minimal context (match AI Senior Dev speed)
    const contextMessage = body.lesson_context
      ? `Lesson Context:\n${body.lesson_context.substring(0, 300)}\n\n`
      : '';

    // Save user message to database first
    const { error: userMessageError } = await supabase.from(chatTable as any).insert({
      user_id: user.id,
      lesson_id: body.lesson_id,
      message: body.message,
      role: 'user',
      mode: body.mode,
      is_off_topic: false,
    });

    if (userMessageError) {
      console.error('Failed to save user message:', userMessageError);
    }

    // Get full response at once (like AI Senior Dev - fast and clean)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS[body.mode],
        },
        {
          role: 'user',
          content: `${contextMessage}Student Question: ${body.message}`,
        },
      ],
      temperature: 0.85, // Match AI Senior Dev settings
      max_tokens: body.mode === 'example' || body.mode === 'explain' ? 700 : 500, // Match AI Senior Dev speed
      stream: false, // Get full response at once
    });

    const fullMessage = completion.choices[0]?.message?.content || '';

    // Save complete assistant response to database
    await supabase.from(chatTable as any).insert({
      user_id: user.id,
      lesson_id: body.lesson_id,
      message: fullMessage,
      role: 'assistant',
      mode: body.mode,
      is_off_topic: false,
    });

    return NextResponse.json({ message: fullMessage });
  } catch (error) {
    console.error('Chat message error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    );
  }
}
