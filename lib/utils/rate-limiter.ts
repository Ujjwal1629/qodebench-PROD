/**
 * Rate Limiter Utility
 * Provides in-memory rate limiting for API endpoints
 *
 * For production at scale, consider using Redis-based rate limiting (e.g., Upstash)
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// Default configurations for different endpoint types
export const RATE_LIMIT_CONFIGS = {
  // AI endpoints - expensive operations
  ai: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 per minute
  aiHint: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 hints per minute

  // Auth endpoints - STRICT brute force protection
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 per 15 minutes
  authLogin: { maxRequests: 5, windowMs: 5 * 60 * 1000 }, // 5 login attempts per 5 minutes
  authSignup: { maxRequests: 3, windowMs: 10 * 60 * 1000 }, // 3 signups per 10 minutes (per IP)
  passwordReset: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  authCallback: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute for OAuth callbacks

  // Payment endpoints - prevent fraud
  payment: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute

  // General API endpoints
  general: { maxRequests: 60, windowMs: 60 * 1000 }, // 60 per minute

  // Submission endpoints
  submission: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 per minute

  // Interview endpoints
  interview: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 per minute

  // Learning chat - moderate limit
  learningChat: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 per minute
} as const;

type RateLimitType = keyof typeof RATE_LIMIT_CONFIGS;

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly CLEANUP_INTERVAL_MS = 60 * 1000; // Cleanup every minute
  private readonly MAX_ENTRIES = 10000; // Prevent memory bloat

  constructor() {
    this.startCleanup();
  }

  /**
   * Check if request should be rate limited
   * Returns { limited: true, retryAfter } if limited
   * Returns { limited: false } if allowed
   */
  check(
    identifier: string,
    type: RateLimitType = 'general'
  ): { limited: boolean; retryAfter?: number; remaining?: number } {
    const config = RATE_LIMIT_CONFIGS[type];
    const key = `${type}:${identifier}`;
    const now = Date.now();

    const entry = this.limits.get(key);

    // No existing entry or window expired - allow request
    if (!entry || now >= entry.resetAt) {
      this.limits.set(key, {
        count: 1,
        resetAt: now + config.windowMs,
      });

      // Enforce max entries to prevent memory issues
      if (this.limits.size > this.MAX_ENTRIES) {
        this.cleanupOldest();
      }

      return { limited: false, remaining: config.maxRequests - 1 };
    }

    // Within window - check count
    if (entry.count >= config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return { limited: true, retryAfter, remaining: 0 };
    }

    // Increment count
    entry.count++;
    return { limited: false, remaining: config.maxRequests - entry.count };
  }

  /**
   * Check rate limit and return NextResponse if limited
   * Usage: const error = rateLimiter.checkAndRespond(userId, 'ai'); if (error) return error;
   */
  checkAndRespond(
    identifier: string,
    type: RateLimitType = 'general'
  ): { error: true; response: Response } | null {
    const result = this.check(identifier, type);

    if (result.limited) {
      const response = new Response(
        JSON.stringify({
          error: 'Too many requests. Please slow down.',
          retryAfter: result.retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(result.retryAfter),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
      return { error: true, response };
    }

    return null;
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    // Only start cleanup if not already running
    if (this.cleanupInterval) return;

    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL_MS);

    // Ensure cleanup interval doesn't prevent process exit
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.limits.entries()) {
      if (now >= entry.resetAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.limits.delete(key));
  }

  /**
   * Remove oldest entries when max is exceeded
   */
  private cleanupOldest(): void {
    // Convert to array, sort by resetAt, remove oldest 10%
    const entries = Array.from(this.limits.entries());
    entries.sort((a, b) => a[1].resetAt - b[1].resetAt);

    const removeCount = Math.ceil(entries.length * 0.1);
    for (let i = 0; i < removeCount; i++) {
      this.limits.delete(entries[i][0]);
    }
  }

  /**
   * Reset rate limit for an identifier (useful for testing)
   */
  reset(identifier: string, type: RateLimitType = 'general'): void {
    const key = `${type}:${identifier}`;
    this.limits.delete(key);
  }

  /**
   * Get current stats (for debugging/monitoring)
   */
  getStats(): { entries: number; maxEntries: number } {
    return {
      entries: this.limits.size,
      maxEntries: this.MAX_ENTRIES,
    };
  }

  /**
   * Stop cleanup interval (for testing/shutdown)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.limits.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Helper function to get user identifier from request
 * Prefers user ID, falls back to IP
 */
export function getRateLimitIdentifier(
  userId?: string | null,
  request?: Request
): string {
  if (userId) {
    return `user:${userId}`;
  }

  if (request) {
    // Try to get IP from headers (works with proxies/load balancers)
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      return `ip:${forwardedFor.split(',')[0].trim()}`;
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
      return `ip:${realIp}`;
    }
  }

  // Fallback to generic identifier (will apply global limit)
  return 'anonymous';
}
