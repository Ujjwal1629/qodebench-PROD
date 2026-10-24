import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatMode } from '@/types/learning';
import { SYSTEM_PROMPTS } from '@/lib/learning/chat-prompts';
import { rateLimiter, getRateLimitIdentifier } from '@/lib/utils/rate-limiter';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const ALLOWED_MODES: ChatMode[] = ['chat', 'example', 'hint'];
const MAX_MESSAGE_LENGTH = 4000;

// Public (no-login) version of /api/learning/chat/message.
// Same prompts and model settings, but nothing is saved — there is no user or lesson.
export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP since there's no user
    const rateLimitResult = rateLimiter.checkAndRespond(
      getRateLimitIdentifier(null, request),
      'learningChat'
    );
    if (rateLimitResult) return rateLimitResult.response;

    const body = (await request.json()) as { message?: unknown; mode?: unknown };
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const mode = body.mode as ChatMode;

    if (!message || !ALLOWED_MODES.includes(mode)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters)` },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS[mode],
        },
        {
          role: 'user',
          content: `Student Question: ${message}`,
        },
      ],
      temperature: 0.85,
      max_tokens: mode === 'example' ? 700 : 500,
      stream: false,
    });

    const fullMessage = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ message: fullMessage });
  } catch (error) {
    console.error('QodeBench chatbot error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
