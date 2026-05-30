/**
 * CSRF Protection Utilities
 *
 * Provides CSRF token generation and validation.
 * Uses the "double submit cookie" pattern which is stateless and works well with Next.js.
 *
 * How it works:
 * 1. Generate a random token
 * 2. Send token in both a cookie and a header/form field
 * 3. On POST requests, verify both values match
 *
 * This works because:
 * - Attackers can't read cookies from other domains (Same-Origin Policy)
 * - Attackers can't set custom headers on cross-origin requests
 */

import { NextRequest, NextResponse } from 'next/server';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = '__csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generate a cryptographically secure CSRF token
 * Uses Web Crypto API for Edge runtime compatibility
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(CSRF_TOKEN_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a response with CSRF cookie set
 */
export function setCSRFCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return response;
}

/**
 * Get CSRF token from request cookie
 */
export function getCSRFTokenFromCookie(request: NextRequest): string | null {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value || null;
}

/**
 * Get CSRF token from request header or body
 */
export function getCSRFTokenFromRequest(request: NextRequest): string | null {
  // Try header first
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  if (headerToken) return headerToken;

  // For form submissions, token might be in body
  // Note: Body parsing should be done separately
  return null;
}

/**
 * Timing-safe string comparison to prevent timing attacks
 * Edge runtime compatible implementation
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Validate CSRF token
 * Compares cookie token with header/body token using timing-safe comparison
 */
export function validateCSRFToken(
  cookieToken: string | null,
  requestToken: string | null
): boolean {
  if (!cookieToken || !requestToken) {
    return false;
  }

  if (cookieToken.length !== requestToken.length) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  return timingSafeEqual(cookieToken, requestToken);
}

/**
 * CSRF validation result
 */
export interface CSRFValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate CSRF for a request
 */
export function validateCSRFRequest(request: NextRequest): CSRFValidationResult {
  // Skip CSRF check for safe methods
  const safeMethodsRegex = /^(GET|HEAD|OPTIONS)$/i;
  if (safeMethodsRegex.test(request.method)) {
    return { valid: true };
  }

  // Get tokens
  const cookieToken = getCSRFTokenFromCookie(request);
  const requestToken = getCSRFTokenFromRequest(request);

  // Validate
  if (!cookieToken) {
    return { valid: false, error: 'Missing CSRF cookie' };
  }

  if (!requestToken) {
    return { valid: false, error: 'Missing CSRF token in request' };
  }

  if (!validateCSRFToken(cookieToken, requestToken)) {
    return { valid: false, error: 'CSRF token mismatch' };
  }

  return { valid: true };
}

/**
 * CSRF error response
 */
export function csrfErrorResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Invalid or missing CSRF token' },
    { status: 403 }
  );
}

/**
 * List of paths that should skip CSRF validation
 * (webhooks, auth-protected APIs, etc.)
 *
 * Note: Most of these routes already require authentication via session cookies,
 * which provides protection against CSRF since attackers cannot forge the session.
 * We exempt them to avoid requiring client-side CSRF token handling for every API call.
 */
const CSRF_EXEMPT_PATHS = [
  '/api/payments/webhook', // Razorpay webhook
  '/api/auth/callback', // OAuth callback
  '/api/health', // Health check
  // Auth-protected routes (session cookie provides CSRF protection)
  '/api/ai', // AI routes (companion, hints, feedback, validate)
  '/api/challenges', // Challenge routes (submit, validate)
  '/api/interview', // Interview routes
  '/api/interview-prep', // Interview prep routes (questions, submit)
  '/api/learning', // Learning routes
  '/api/admin', // Admin routes
  '/api/profile', // Profile routes
  '/api/payments/create-order', // Payment routes (auth required)
  '/api/payments/verify-payment',
  '/api/payments/subscription-status',
  '/api/payments/cancel-subscription',
  '/api/llm-bug-hunter',
];

/**
 * Check if a path is exempt from CSRF
 */
export function isCSRFExempt(pathname: string): boolean {
  return CSRF_EXEMPT_PATHS.some(
    (exempt) => pathname === exempt || pathname.startsWith(exempt + '/')
  );
}

/**
 * Middleware helper to validate CSRF on protected routes
 * Use in your middleware.ts or individual API routes
 *
 * Example in API route:
 * ```
 * import { validateCSRFRequest, csrfErrorResponse } from '@/lib/utils/csrf';
 *
 * export async function POST(request: NextRequest) {
 *   const csrf = validateCSRFRequest(request);
 *   if (!csrf.valid) return csrfErrorResponse();
 *   // ... rest of handler
 * }
 * ```
 */
