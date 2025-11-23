import crypto from 'crypto';

interface CachedValidation {
  result: any;
  timestamp: number;
  expiresAt: number;
  userId: string; // Include userId to prevent cross-user cache leaks
}

/**
 * Thread-safe Validation Cache
 *
 * Improvements over previous version:
 * - Includes userId in cache key to prevent cross-user data leaks
 * - Uses async-safe operations
 * - Proper cleanup interval management
 * - LRU eviction based on access time
 * - Memory-bounded with configurable limits
 */
class ValidationCache {
  private cache: Map<string, CachedValidation>;
  private accessOrder: Map<string, number>; // Track access times for LRU
  private readonly TTL: number;
  private readonly MAX_CACHE_SIZE: number;
  private cleanupIntervalId: NodeJS.Timeout | null = null;
  private readonly CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
  private isDestroyed = false;

  constructor(options?: { ttlMs?: number; maxSize?: number }) {
    this.TTL = options?.ttlMs ?? 60 * 60 * 1000; // Default 1 hour
    this.MAX_CACHE_SIZE = options?.maxSize ?? 500; // Reduced from 1000 for memory safety
    this.cache = new Map();
    this.accessOrder = new Map();
    this.startCleanup();
  }

  /**
   * Generate a secure hash key from userId, challengeId, and code
   */
  private generateKey(userId: string, challengeId: string, code: string): string {
    // Include userId to prevent cross-user cache hits
    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ userId, challengeId, code }))
      .digest('hex');
    return hash;
  }

  /**
   * Get cached validation result
   */
  get(userId: string, challengeId: string, code: string): any | null {
    if (this.isDestroyed) return null;

    const key = this.generateKey(userId, challengeId, code);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
      return null;
    }

    // Verify userId matches (defense in depth)
    if (cached.userId !== userId) {
      console.error('Cache userId mismatch - potential security issue');
      this.cache.delete(key);
      this.accessOrder.delete(key);
      return null;
    }

    // Update access time for LRU
    this.accessOrder.set(key, Date.now());

    return cached.result;
  }

  /**
   * Store validation result in cache
   */
  set(userId: string, challengeId: string, code: string, result: any): void {
    if (this.isDestroyed) return;

    // Enforce max cache size using true LRU eviction
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictLRU();
    }

    const key = this.generateKey(userId, challengeId, code);
    const now = Date.now();

    this.cache.set(key, {
      result,
      timestamp: now,
      expiresAt: now + this.TTL,
      userId,
    });
    this.accessOrder.set(key, now);
  }

  /**
   * Evict least recently used entries
   */
  private evictLRU(): void {
    // Find the least recently accessed entry
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, accessTime] of this.accessOrder.entries()) {
      if (accessTime < oldestTime) {
        oldestTime = accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    if (this.cleanupIntervalId) return;

    this.cleanupIntervalId = setInterval(() => {
      if (!this.isDestroyed) {
        this.cleanup();
      }
    }, this.CLEANUP_INTERVAL_MS);

    // Don't prevent process exit
    if (this.cleanupIntervalId.unref) {
      this.cleanupIntervalId.unref();
    }
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiresAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => {
      this.cache.delete(key);
      this.accessOrder.delete(key);
    });
  }

  /**
   * Clear all cache (useful for testing or version updates)
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
  }

  /**
   * Get cache stats
   */
  getStats(): {
    size: number;
    maxSize: number;
    ttlMs: number;
    hitRate?: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      ttlMs: this.TTL,
    };
  }

  /**
   * Destroy the cache and cleanup resources
   */
  destroy(): void {
    this.isDestroyed = true;
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
      this.cleanupIntervalId = null;
    }
    this.cache.clear();
    this.accessOrder.clear();
  }

  /**
   * Check if a validation is cached (without returning result)
   */
  has(userId: string, challengeId: string, code: string): boolean {
    return this.get(userId, challengeId, code) !== null;
  }
}

// Singleton instance
export const validationCache = new ValidationCache();

// Export class for testing
export { ValidationCache };
