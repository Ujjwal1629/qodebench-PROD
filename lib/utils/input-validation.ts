/**
 * Input Validation Utilities
 * Provides validation schemas and size limits for API inputs
 */

import { z } from 'zod';

// Maximum input sizes
export const INPUT_LIMITS = {
  code: 50000, // 50KB max code
  message: 2000, // 2KB max message
  description: 5000, // 5KB description
  conversationHistory: 20, // Max 20 messages in history
  jsonPayload: 100000, // 100KB max JSON payload
  answers: 100, // Max 100 answers in a batch
} as const;

/**
 * Validate request body size before parsing
 */
export async function validateRequestSize(
  request: Request,
  maxSizeBytes: number = INPUT_LIMITS.jsonPayload
): Promise<{ valid: true; body: string } | { valid: false; error: string }> {
  const contentLength = request.headers.get('content-length');

  if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
    return {
      valid: false,
      error: `Request body too large. Maximum size is ${Math.round(maxSizeBytes / 1024)}KB`,
    };
  }

  try {
    const body = await request.text();

    if (body.length > maxSizeBytes) {
      return {
        valid: false,
        error: `Request body too large. Maximum size is ${Math.round(maxSizeBytes / 1024)}KB`,
      };
    }

    return { valid: true, body };
  } catch {
    return { valid: false, error: 'Failed to read request body' };
  }
}

/**
 * Safe JSON parse with size validation
 */
export async function safeJsonParse<T>(
  request: Request,
  schema: z.ZodSchema<T>,
  maxSizeBytes: number = INPUT_LIMITS.jsonPayload
): Promise<
  | { success: true; data: T }
  | { success: false; error: string; status: number }
> {
  const sizeResult = await validateRequestSize(request, maxSizeBytes);

  if (!sizeResult.valid) {
    return { success: false, error: sizeResult.error, status: 413 };
  }

  try {
    const json = JSON.parse(sizeResult.body);
    const result = schema.safeParse(json);

    if (!result.success) {
      const errors = result.error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      return { success: false, error: `Validation failed: ${errors}`, status: 400 };
    }

    return { success: true, data: result.data };
  } catch {
    return { success: false, error: 'Invalid JSON in request body', status: 400 };
  }
}

// Common validation schemas

export const aiCompanionSchema = z.object({
  challengeId: z.string().uuid().optional(),
  challengeTitle: z.string().max(200).optional(),
  challengeDescription: z.string().max(INPUT_LIMITS.description).optional(),
  currentCode: z.string().max(INPUT_LIMITS.code).optional(),
  difficulty: z.string().max(50).optional(),
  mode: z.enum(['hint', 'review', 'explain', 'breakdown', 'chat']).default('chat'),
  message: z.string().min(1).max(INPUT_LIMITS.message),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(INPUT_LIMITS.message),
        mode: z.string().optional(),
      })
    )
    .max(INPUT_LIMITS.conversationHistory)
    .optional(),
});

export const challengeSubmitSchema = z.object({
  challengeId: z.string().uuid(),
  code: z.string().min(1).max(INPUT_LIMITS.code),
  language: z.string().max(50).optional(),
  validationResult: z.object({
    passed: z.boolean(),
    score: z.number().min(0).max(100).optional(),
    pointsEarned: z.number().min(0).optional(),
    codeQuality: z.any().optional(),
    improvements: z.any().optional(),
    suggestions: z.any().optional(),
    strengths: z.any().optional(),
    testResults: z.any().optional(),
  }),
});

export const autosaveSchema = z.object({
  sessionId: z.string().uuid(),
  stage: z.enum([
    'stage_1_mcq',
    'stage_2_voice_qa',
    'stage_3_coding',
    'stage_4_text_qa',
    'stage_5_discussion',
  ]),
  data: z.any(),
  currentQuestionIndex: z.number().int().min(0).optional(),
  uiState: z.any().optional(),
});

export const mcqAnswersSchema = z.record(
  z.string().uuid(), // questionId
  z.string().max(10) // selectedOption (a, b, c, d)
).refine(
  (obj) => Object.keys(obj).length <= INPUT_LIMITS.answers,
  `Maximum ${INPUT_LIMITS.answers} answers allowed`
);

export const paymentVerifySchema = z.object({
  razorpay_order_id: z.string().min(1).max(100),
  razorpay_payment_id: z.string().min(1).max(100),
  razorpay_signature: z.string().min(1).max(500),
  tier: z.enum(['launch_offer', 'quarterly', 'yearly']),
});

export const learningChatSchema = z.object({
  lesson_id: z.string().uuid().optional(),
  module_id: z.string().uuid().optional(),
  message: z.string().min(1).max(INPUT_LIMITS.message),
  mode: z.enum(['ask', 'explain', 'quiz']).default('ask'),
  quiz_id: z.string().uuid().optional(),
});

/**
 * Sanitize user input to prevent XSS in stored content
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Truncate string to max length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Validate UUID format
 * SECURITY: Prevents SQL injection via malformed UUIDs
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}
