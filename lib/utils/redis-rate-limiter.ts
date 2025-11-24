/**
 * Redis-based Rate Limiter using Upstash
 *
 * Provides distributed rate limiting that works across multiple server instances.
 * Falls back to in-memory rate limiting if Redis is not configured.
 *
 * Setup:
 * 1. Create account at https://upstash.com
 * 2. Create a Redis database
 * 3. Add to .env.local:
 *    UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
 *    UPSTASH_REDIS_REST_TOKEN=your-token
 *
 * npm install @upstash/redis @upstash/ratelimit
 */

import { logger } from './logger';

// Rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  // AI endpoints - expensive operations
  ai: { requests: 20, window: '1m' },
  aiHint: { requests: 10, window: '1m' },

  // Auth endpoints - STRICT brute force protection
  auth: { requests: 5, window: '15m' },
  authLogin: { requests: 5, window: '5m' },
  authSignup: { requests: 3, window: '10m' },
  passwordReset: { requests: 3, window: '1h' },
  authCallback: { requests: 10, window: '1m' },

  // Payment endpoints - prevent fraud
  payment: { requests: 10, window: '1m' },

  // General API endpoints
  general: { requests: 60, window: '1m' },

  // Submission endpoints
  submission: { requests: 30, window: '1m' },

  // Interview endpoints
  interview: { requests: 20, window: '1m' },

  // Learning chat - moderate limit
  learningChat: { requests: 30, window: '1m' },
} as const;

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIGS;

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory fallback storage
interface InMemoryEntry {
  count: number;
  resetAt: number;
}

const inMemoryStore = new Map<string, InMemoryEntry>();

// Convert window string to milliseconds
function windowToMs(window: string): number {
  const match = window.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return 60000; // default 1 minute

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 60000;
  }
}

// Check if Upstash is configured
function isUpstashConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

// Dynamic import for Upstash (only when configured and installed)
let redisClient: any = null;
let rateLimiters: Map<string, any> = new Map();

async function initializeUpstash(): Promise<boolean> {
  if (!isUpstashConfigured()) {
    logger.info('Upstash not configured, using in-memory rate limiter');
    return false;
  }

  try {
    // Dynamic import using variable to avoid TypeScript static analysis
    // This allows the code to work even when packages are not installed
    const redisPackage = '@upstash/redis';
    const ratelimitPackage = '@upstash/ratelimit';

    // @ts-ignore - Dynamic imports with variable names
    const redisModule = await import(/* webpackIgnore: true */ redisPackage).catch(() => null);
    // @ts-ignore - Dynamic imports with variable names
    const RatelimitModule = await import(/* webpackIgnore: true */ ratelimitPackage).catch(() => null);

    if (!redisModule?.Redis || !RatelimitModule?.Ratelimit) {
      logger.info('Upstash packages not installed, using in-memory rate limiter');
      return false;
    }

    const Redis = redisModule.Redis;
    const { Ratelimit } = RatelimitModule;

    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    // Create rate limiters for each type
    for (const [type, config] of Object.entries(RATE_LIMIT_CONFIGS)) {
      rateLimiters.set(
        type,
        new Ratelimit({
          redis: redisClient,
          limiter: Ratelimit.slidingWindow(config.requests, config.window),
          prefix: `ratelimit:${type}`,
          analytics: true,
        })
      );
    }

    logger.info('Upstash Redis rate limiter initialized');
    return true;
  } catch (error) {
    logger.warn('Failed to initialize Upstash, using in-memory fallback', {},
      error instanceof Error ? error : new Error(String(error)));
    return false;
  }
}

// Lazy initialization
let initialized = false;
let useRedis = false;

async function ensureInitialized(): Promise<void> {
  if (!initialized) {
    initialized = true;
    useRedis = await initializeUpstash();
  }
}

/**
 * In-memory rate limit check (fallback)
 */
function checkInMemory(
  identifier: string,
  type: RateLimitType
): RateLimitResult {
  const config = RATE_LIMIT_CONFIGS[type];
  const windowMs = windowToMs(config.window);
  const key = `${type}:${identifier}`;
  const now = Date.now();

  const entry = inMemoryStore.get(key);

  // No entry or window expired
  if (!entry || now >= entry.resetAt) {
    inMemoryStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      success: true,
      limit: config.requests,
      remaining: config.requests - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  // Check limit
  if (entry.count >= config.requests) {
    return {
      success: false,
      limit: config.requests,
      remaining: 0,
      reset: Math.ceil(entry.resetAt / 1000),
    };
  }

  // Increment
  entry.count++;

  return {
    success: true,
    limit: config.requests,
    remaining: config.requests - entry.count,
    reset: Math.ceil(entry.resetAt / 1000),
  };
}

/**
 * Check rate limit using Redis or in-memory fallback
 */
export async function checkRateLimit(
  identifier: string,
  type: RateLimitType = 'general'
): Promise<RateLimitResult> {
  await ensureInitialized();

  if (useRedis && rateLimiters.has(type)) {
    try {
      const ratelimit = rateLimiters.get(type);
      const result = await ratelimit.limit(identifier);

      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch (error) {
      logger.warn('Redis rate limit check failed, using fallback', { type, identifier });
      return checkInMemory(identifier, type);
    }
  }

  return checkInMemory(identifier, type);
}

/**
 * Check rate limit and return Response if limited
 */
export async function checkRateLimitAndRespond(
  identifier: string,
  type: RateLimitType = 'general'
): Promise<{ error: true; response: Response } | null> {
  const result = await checkRateLimit(identifier, type);

  if (!result.success) {
    const retryAfter = result.reset - Math.floor(Date.now() / 1000);

    const response = new Response(
      JSON.stringify({
        error: 'Too many requests. Please slow down.',
        retryAfter: Math.max(retryAfter, 1),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.max(retryAfter, 1)),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(result.reset),
        },
      }
    );

    return { error: true, response };
  }

  return null;
}

/**
 * Get rate limit identifier from request
 */
export function getRateLimitIdentifier(
  userId?: string | null,
  request?: Request
): string {
  if (userId) {
    return `user:${userId}`;
  }

  if (request) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      return `ip:${forwardedFor.split(',')[0].trim()}`;
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
      return `ip:${realIp}`;
    }
  }

  return 'anonymous';
}

/**
 * Get rate limiter status (for monitoring)
 */
export async function getRateLimiterStatus(): Promise<{
  type: 'redis' | 'memory';
  configured: boolean;
  healthy: boolean;
}> {
  await ensureInitialized();

  if (useRedis && redisClient) {
    try {
      await redisClient.ping();
      return { type: 'redis', configured: true, healthy: true };
    } catch {
      return { type: 'redis', configured: true, healthy: false };
    }
  }

  return { type: 'memory', configured: false, healthy: true };
}

/**
 * Clear in-memory store (for testing)
 */
export function clearInMemoryStore(): void {
  inMemoryStore.clear();
}

// Periodic cleanup for in-memory store
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of inMemoryStore.entries()) {
    if (now >= entry.resetAt) {
      inMemoryStore.delete(key);
    }
  }
}, 60 * 1000).unref?.();
