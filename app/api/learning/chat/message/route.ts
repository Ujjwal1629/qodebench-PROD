import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { ChatRequest, ChatMode } from '@/types/learning';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// System prompts for different modes
const SYSTEM_PROMPTS: Record<ChatMode, string> = {
  explain: `You're an experienced web development mentor with years of industry experience. Guide learners through HTML/CSS concepts with clarity and professionalism.

Break down complex topics into digestible insights. Draw from real-world scenarios and best practices used in professional development. Be encouraging while maintaining technical accuracy.

Keep responses concise (2-3 paragraphs). Reference the current lesson context to provide relevant, actionable guidance.`,

  example: `You're a senior developer sharing production-ready code examples. When asked for examples, provide clean, maintainable code that follows industry standards and best practices.

Explain the reasoning behind your design decisions. Add clear comments highlighting key concepts. Focus on teaching patterns they'll use in real projects.

Always use markdown code blocks for proper formatting. Keep examples practical and directly relevant to their learning goals.`,

  hint: `You're a development mentor guiding learners through problem-solving. When they're stuck on quiz questions, help them develop critical thinking skills rather than providing direct answers.

Ask strategic questions that lead them to insights. Connect their questions to core concepts from the lesson. Build their confidence in reasoning through problems independently.

Be patient and constructive. The goal is to strengthen their understanding and problem-solving abilities.`,

  progress: `You're removed from the chat interface - this mode is no longer used.`,

  chat: `You're a senior web development mentor providing professional guidance on HTML and CSS. Share your expertise naturally, as if mentoring a junior developer who's eager to learn.

Answer questions with clarity and depth. Provide practical examples when they help illustrate concepts. Stay focused on web development fundamentals and industry best practices.

Maintain a professional yet approachable tone. Draw from real-world experience to make concepts tangible and relevant.`,
};

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

    // Build context from lesson content
    const contextMessage = body.lesson_context
      ? `Current Lesson Context:\n${body.lesson_context.substring(0, 1500)}...\n\n`
      : '';

    // Save user message to database first
    const { error: userMessageError } = await supabase.from('html_css_chat_history').insert({
      user_id: user.id,
      lesson_id: body.lesson_id,
      message: body.message,
      role: 'user',
      mode: body.mode,
    });

    if (userMessageError) {
      console.error('Failed to save user message:', userMessageError);
    }

    // Create streaming response
    const stream = await openai.chat.completions.create({
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
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });

    // Create a readable stream to send to the frontend
    let fullMessage = '';

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullMessage += content;
              controller.enqueue(encoder.encode(content));
            }
          }

          // Save complete assistant response to database after streaming
          await supabase.from('html_css_chat_history').insert({
            user_id: user.id,
            lesson_id: body.lesson_id,
            message: fullMessage,
            role: 'assistant',
            mode: body.mode,
          });

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat message error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send message' },
      { status: 500 }
    );
  }
}
