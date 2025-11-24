/**
 * Singleton OpenAI Client
 *
 * Provides a single, reusable OpenAI client instance with:
 * - Proper connection pooling
 * - Timeout handling
 * - Retry configuration
 */

import OpenAI from 'openai';

// Singleton instance
let openaiClient: OpenAI | null = null;

/**
 * Get the singleton OpenAI client instance
 * Creates one if it doesn't exist
 */
export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is not configured. Please add it to your environment variables.'
      );
    }

    openaiClient = new OpenAI({
      apiKey,
      timeout: 30000, // 30 second timeout
      maxRetries: 2, // Retry up to 2 times on failure
    });
  }

  return openaiClient;
}

/**
 * Create a chat completion with timeout handling
 * Wraps the OpenAI API call with an AbortController for proper timeout
 */
export async function createChatCompletion(
  params: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
  timeoutMs: number = 30000
): Promise<OpenAI.Chat.ChatCompletion> {
  const openai = getOpenAIClient();
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const completion = await openai.chat.completions.create(params, {
      signal: controller.signal,
    });
    return completion;
  } catch (error: any) {
    if (error.name === 'AbortError' || controller.signal.aborted) {
      throw new Error(`OpenAI API request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Create a streaming chat completion with timeout handling
 */
export async function createStreamingChatCompletion(
  params: OpenAI.Chat.ChatCompletionCreateParamsStreaming,
  timeoutMs: number = 60000 // Longer timeout for streaming
): Promise<AsyncIterable<OpenAI.Chat.ChatCompletionChunk>> {
  const openai = getOpenAIClient();
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const stream = await openai.chat.completions.create(params, {
      signal: controller.signal,
    });

    // Clear timeout once stream starts (we'll handle streaming timeout differently)
    clearTimeout(timeoutId);

    return stream;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError' || controller.signal.aborted) {
      throw new Error(`OpenAI API request timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}

/**
 * Handle OpenAI API errors with appropriate responses
 */
export function handleOpenAIError(error: any): {
  message: string;
  status: number;
  retryAfter?: number;
} {
  // Rate limit error
  if (error.status === 429) {
    const retryAfter = parseInt(error.headers?.['retry-after'] || '60', 10);
    return {
      message: 'AI service is busy. Please try again in a moment.',
      status: 429,
      retryAfter,
    };
  }

  // Timeout error
  if (error.message?.includes('timed out') || error.name === 'AbortError') {
    return {
      message: 'AI response took too long. Please try again.',
      status: 504,
    };
  }

  // Invalid API key
  if (error.status === 401) {
    console.error('OpenAI API key is invalid or expired');
    return {
      message: 'AI service is temporarily unavailable.',
      status: 503,
    };
  }

  // Quota exceeded
  if (error.status === 402 || error.code === 'insufficient_quota') {
    console.error('OpenAI API quota exceeded');
    return {
      message: 'AI service is temporarily unavailable.',
      status: 503,
    };
  }

  // Generic error
  console.error('OpenAI API error:', error);
  return {
    message: 'Failed to get AI response. Please try again.',
    status: 500,
  };
}

/**
 * Fallback responses for when AI is unavailable
 */
export const AI_FALLBACK_RESPONSES = {
  hint: "I'm having trouble connecting to the AI right now. Try these debugging steps:\n1. Check your console for error messages\n2. Add console.log statements to trace the execution\n3. Review your logic step by step\n4. Check edge cases like empty arrays or null values",

  review:
    "AI review is temporarily unavailable. Here are some general code review tips:\n1. Check for null/undefined handling\n2. Look for potential edge cases\n3. Ensure proper error handling\n4. Verify variable naming is descriptive\n5. Check for any hardcoded values that should be constants",

  explain:
    'AI explanation is temporarily unavailable. Try checking the documentation or searching for tutorials on this concept.',

  chat: "I'm having trouble responding right now. Please try again in a moment.",
};

/**
 * Cost estimation for logging/monitoring
 * Approximate costs per 1K tokens (as of 2024)
 */
export const TOKEN_COSTS = {
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
} as const;

/**
 * Estimate cost of a completion
 */
export function estimateCost(
  model: keyof typeof TOKEN_COSTS,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = TOKEN_COSTS[model] || TOKEN_COSTS['gpt-4o-mini'];
  return (inputTokens / 1000) * costs.input + (outputTokens / 1000) * costs.output;
}
