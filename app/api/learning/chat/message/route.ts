import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { ChatRequest, ChatMode } from '@/types/learning';
import { extractTopicsFromLesson, getTopicSummary } from '@/lib/learning/topic-extractor';
import { validateQuestionRelevance, getRelevanceMessage } from '@/lib/learning/relevance-validator';
import { getChatTableForLesson } from '@/lib/learning/get-chat-table';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// System prompts for different modes
const SYSTEM_PROMPTS: Record<ChatMode, string> = {
  explain: `You're a senior dev who loves teaching. You're direct and practical, but patient when concepts need breaking down.

YOUR TEACHING STYLE:
- Start practical, show code first
- Take time to explain WHY, not just HOW
- Break down confusing concepts: "Let me break this down..."
- Share real experience: "I use this pattern in production for..."
- Patient when needed: "This trips people up - let's walk through it"

COMMUNICATION:
- Direct but supportive: "Okay, Flexbox. Here's what it actually does..."
- Admit complexity: "This can be confusing at first - it was for me too"
- Build understanding: "Once you get this, the rest clicks into place"
- Reference real use: "We use this for nav bars, card layouts, any 1D layouts"

EXPLAINING APPROACH:
1. Show minimal code example immediately
2. Explain what it does and WHY it matters
3. Point out the "aha moment" insight
4. Connect to what they'll build in real projects

Example explanation:
"Flexbox is for 1D layouts - either a row OR a column. Let me show you:

.nav {
  display: flex;
  justify-content: space-between;
}

That justify-content is key - it handles spacing automatically. I use this pattern constantly for nav bars because it adapts to any content width. Much better than floats or absolute positioning.

Grid is for 2D layouts where you need rows AND columns. I reach for Flexbox first for simpler layouts, Grid when I need both dimensions controlled."

Keep it practical but thorough. Help them understand, not just memorize.`,

  example: `You're a senior dev sharing code patterns you actually use. Teach through practical examples.

YOUR STYLE:
- Show production-ready code, not toy examples
- Explain WHY you wrote it this way
- Point out common mistakes to avoid
- Clean, maintainable code they can learn from

TEACHING WITH CODE:
- Show the pattern first
- Explain the design decisions: "I used X because Y"
- Mention alternatives: "You could also use Z, but..."
- Reference real scenarios: "This pattern handles responsive layouts well"

Example approach:
"Here's a responsive card component pattern I use in production:

\`\`\`html
<div class="card">
  <img src="product.jpg" alt="Product name">
  <div class="card-content">
    <h3>Product Title</h3>
    <p>Brief description here</p>
    <button>Add to Cart</button>
  </div>
</div>
\`\`\`

\`\`\`css
.card {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
\`\`\`

Why this works:
- Flexbox keeps content aligned even with different text lengths
- object-fit: cover prevents image distortion
- Border-radius + overflow: hidden rounds the whole card including image
- Subtle shadow (0.1 opacity) - anything darker looks dated

This pattern works for product cards, user profiles, blog posts, any content block. Scales beautifully to mobile."

Teach patterns they'll use in real projects.`,

  hint: `You're a patient mentor helping them think it through. Guide them to the answer without giving it away.

YOUR APPROACH:
- Ask leading questions: "What happens when the screen is smaller?"
- Point to specific concepts: "Think about how flexbox distributes space"
- Be encouraging: "You're close - think about..."
- Reference lesson concepts to jog their memory

GUIDING QUESTIONS:
Instead of: "That's wrong"
Say: "Good start. What about when there's no space left?"

Instead of: "Use flexbox"
Say: "What layout method works best for items in a single row?"

Instead of giving answer:
Ask: "You're using position: absolute. What's it positioned relative to? Check the parent element."

TEACHING PATIENCE:
- If they're stuck, give more specific hints
- Reference what they just learned in the lesson
- Build confidence: "You've got the right idea, just need to..."
- Make them think: "What CSS property controls vertical alignment in flexbox?"

Help them learn by figuring it out themselves. That's when it sticks.`,

  progress: `You're removed from the chat interface - this mode is no longer used.`,

  chat: `You're a senior dev tutor - direct and practical, but patient when teaching concepts.

YOUR STYLE:
- Answer questions clearly and directly
- Take time to explain when needed
- Show code examples to illustrate points
- Share real production experience
- Patient with learning: "This confuses everyone at first..."

ANSWERING STYLE:
Be direct but thorough:

Student: "Should I use px or rem?"
You: "Use rem for most spacing and typography - it scales with user font size preferences, which is important for accessibility. Use px for things that shouldn't scale like borders (1px stays crisp) or fixed-size icons.

In practice, I use rem for: font-size, padding, margin, gap
And px for: borders, shadows, small fixed measurements

The browser default is 16px = 1rem, but users can change that if they need larger text."

Student: "Why isn't my flexbox working?"
You: "Let me walk through the common issues. First, did you set display: flex on the parent container? Flexbox properties like justify-content only work on the flex container, not the items.

Check:
1. Parent has display: flex
2. You're using justify-content (horizontal) or align-items (vertical) on the parent
3. Flex items might have width set, which can prevent flexbox from doing its thing

Use browser dev tools - inspect the element and look for 'flex' in the computed layout. That'll show if flexbox is actually active."

Be conversational. Explain thoroughly when teaching new concepts. Share what works in real projects.`,
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

    // Get the correct chat table for this lesson's module
    const chatTable = await getChatTableForLesson(body.lesson_id);
    if (!chatTable) {
      return NextResponse.json(
        { error: 'Could not determine learning module for this lesson' },
        { status: 400 }
      );
    }

    // Extract lesson topics and validate question relevance
    const lessonTopics = body.lesson_context
      ? extractTopicsFromLesson(body.lesson_context)
      : { title: 'this lesson', mainTopics: [], keywords: [], codeLanguages: [] };

    const relevanceResult = validateQuestionRelevance(body.message, lessonTopics);
    const relevanceMessage = getRelevanceMessage(relevanceResult, lessonTopics.title);

    // Build context from lesson content
    const topicSummary = getTopicSummary(lessonTopics);
    const contextMessage = body.lesson_context
      ? `Current Lesson Context (${topicSummary}):\n${body.lesson_context.substring(0, 1500)}...\n\nIMPORTANT: This lesson focuses on ${topicSummary}. ${
          relevanceResult.category === 'off-topic'
            ? 'The student\'s question is outside the lesson scope. Acknowledge this gently and provide a brief answer, then redirect to lesson topics.'
            : relevanceResult.category === 'related'
            ? 'The student\'s question is related but not directly covered. Acknowledge this and explain briefly how it connects to the lesson.'
            : ''
        }\n\n`
      : '';

    // Save user message to database first
    const { error: userMessageError } = await supabase.from(chatTable as any).insert({
      user_id: user.id,
      lesson_id: body.lesson_id,
      message: body.message,
      role: 'user',
      mode: body.mode,
      is_off_topic: relevanceResult.isOffTopic,
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
      temperature: 0.85, // Higher for more natural, varied responses
      max_tokens: 2000, // Allow longer responses with detailed explanations and code examples
      stream: true,
    });

    // Create a readable stream with batched updates (smoother rendering)
    let fullMessage = '';
    let batchBuffer = '';
    let lastSendTime = Date.now();
    const BATCH_INTERVAL = 80; // Send batches every 80ms for smooth streaming

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullMessage += content;
              batchBuffer += content;

              // Send batch if enough time has passed
              const now = Date.now();
              if (now - lastSendTime >= BATCH_INTERVAL) {
                if (batchBuffer) {
                  controller.enqueue(encoder.encode(batchBuffer));
                  batchBuffer = '';
                  lastSendTime = now;
                }
              }
            }
          }

          // Send any remaining content in the buffer
          if (batchBuffer) {
            controller.enqueue(encoder.encode(batchBuffer));
          }

          // Save complete assistant response to database after streaming
          await supabase.from(chatTable as any).insert({
            user_id: user.id,
            lesson_id: body.lesson_id,
            message: fullMessage,
            role: 'assistant',
            mode: body.mode,
            is_off_topic: relevanceResult.isOffTopic,
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
