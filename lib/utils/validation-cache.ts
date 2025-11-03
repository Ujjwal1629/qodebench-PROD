import crypto from 'crypto';

interface CachedValidation {
  result: any;
  timestamp: number;
  expiresAt: number;
}

class ValidationCache {
  private cache: Map<string, CachedValidation>;
  private readonly TTL = 1000 * 60 * 60; // 1 hour cache TTL
  private readonly MAX_CACHE_SIZE = 1000; // Max 1000 cached validations

  constructor() {
    this.cache = new Map();
    // Clean up expired entries every 10 minutes
    setInterval(() => this.cleanup(), 1000 * 60 * 10);
  }

  /**
   * Generate a hash key from challenge ID and code
   */
  private generateKey(challengeId: string, code: string): string {
    const hash = crypto
      .createHash('sha256')
      .update(`${challengeId}:${code}`)
      .digest('hex');
    return hash;
  }

  /**
   * Get cached validation result
   */
  get(challengeId: string, code: string): any | null {
    const key = this.generateKey(challengeId, code);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.result;
  }

  /**
   * Store validation result in cache
   */
  set(challengeId: string, code: string, result: any): void {
    // Enforce max cache size (LRU-style: delete oldest)
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const key = this.generateKey(challengeId, code);
    const now = Date.now();

    this.cache.set(key, {
      result,
      timestamp: now,
      expiresAt: now + this.TTL,
    });
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

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Clear all cache (useful for testing)
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      ttl: this.TTL,
    };
  }
}

// Singleton instance
export const validationCache = new ValidationCache();
