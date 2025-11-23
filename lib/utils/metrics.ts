/**
 * Metrics Collection Utility
 *
 * Tracks application metrics for monitoring and analytics:
 * - API request counts and latencies
 * - Error rates
 * - Feature usage (challenges, interviews, AI, etc.)
 * - Active users
 *
 * Data is stored in-memory with periodic aggregation.
 * For production at scale, integrate with:
 * - Prometheus + Grafana
 * - Datadog
 * - New Relic
 * - CloudWatch
 */

interface RequestMetric {
  count: number;
  totalLatency: number;
  errors: number;
  lastUpdated: number;
}

interface FeatureMetric {
  count: number;
  uniqueUsers: Set<string>;
  lastUsed: number;
}

interface TimeSeriesPoint {
  timestamp: number;
  requests: number;
  errors: number;
  avgLatency: number;
  activeUsers: number;
}

// SECURITY: Memory limits to prevent DoS via metrics accumulation
const MAX_ENDPOINT_METRICS = 1000;
const MAX_FEATURE_METRICS = 500;

class MetricsCollector {
  // API endpoint metrics
  private apiMetrics: Map<string, RequestMetric> = new Map();

  // Feature usage metrics
  private featureMetrics: Map<string, FeatureMetric> = new Map();

  // Active users tracking (last 5 minutes)
  private activeUsers: Map<string, number> = new Map();
  private readonly ACTIVE_USER_WINDOW_MS = 5 * 60 * 1000;

  // Time series data (hourly aggregates, last 24 hours)
  private timeSeries: TimeSeriesPoint[] = [];
  private readonly MAX_TIME_SERIES_POINTS = 24;

  // Totals
  private totalRequests = 0;
  private totalErrors = 0;
  private startTime = Date.now();

  // Cleanup interval
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
  }

  /**
   * Track an API request
   */
  trackRequest(
    endpoint: string,
    method: string,
    latencyMs: number,
    statusCode: number,
    userId?: string
  ): void {
    const key = `${method}:${endpoint}`;
    const isError = statusCode >= 400;

    // SECURITY: Enforce memory limit for endpoint metrics
    if (this.apiMetrics.size >= MAX_ENDPOINT_METRICS && !this.apiMetrics.has(key)) {
      this.evictOldestEndpointMetrics();
    }

    // Update endpoint metrics
    const metric = this.apiMetrics.get(key) || {
      count: 0,
      totalLatency: 0,
      errors: 0,
      lastUpdated: Date.now(),
    };

    metric.count++;
    metric.totalLatency += latencyMs;
    if (isError) metric.errors++;
    metric.lastUpdated = Date.now();

    this.apiMetrics.set(key, metric);

    // Update totals
    this.totalRequests++;
    if (isError) this.totalErrors++;

    // Track active user
    if (userId) {
      this.activeUsers.set(userId, Date.now());
    }
  }

  /**
   * Track feature usage
   */
  trackFeature(
    feature: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    // SECURITY: Enforce memory limit for feature metrics
    if (this.featureMetrics.size >= MAX_FEATURE_METRICS && !this.featureMetrics.has(feature)) {
      this.evictOldestFeatureMetrics();
    }

    const metric = this.featureMetrics.get(feature) || {
      count: 0,
      uniqueUsers: new Set<string>(),
      lastUsed: Date.now(),
    };

    metric.count++;
    metric.lastUsed = Date.now();
    if (userId) {
      metric.uniqueUsers.add(userId);
    }

    this.featureMetrics.set(feature, metric);
  }

  /**
   * Get current active users count
   */
  getActiveUsersCount(): number {
    const cutoff = Date.now() - this.ACTIVE_USER_WINDOW_MS;
    let count = 0;

    for (const [, lastSeen] of this.activeUsers) {
      if (lastSeen > cutoff) count++;
    }

    return count;
  }

  /**
   * Get overview metrics
   */
  getOverview(): {
    uptime: number;
    totalRequests: number;
    totalErrors: number;
    errorRate: number;
    activeUsers: number;
    requestsPerMinute: number;
  } {
    const uptimeMs = Date.now() - this.startTime;
    const uptimeMinutes = uptimeMs / (60 * 1000);

    return {
      uptime: Math.floor(uptimeMs / 1000),
      totalRequests: this.totalRequests,
      totalErrors: this.totalErrors,
      errorRate: this.totalRequests > 0
        ? (this.totalErrors / this.totalRequests) * 100
        : 0,
      activeUsers: this.getActiveUsersCount(),
      requestsPerMinute: uptimeMinutes > 0
        ? this.totalRequests / uptimeMinutes
        : 0,
    };
  }

  /**
   * Get top endpoints by request count
   */
  getTopEndpoints(limit = 10): Array<{
    endpoint: string;
    count: number;
    avgLatency: number;
    errorRate: number;
  }> {
    return [...this.apiMetrics.entries()]
      .map(([endpoint, metric]) => ({
        endpoint,
        count: metric.count,
        avgLatency: metric.count > 0 ? metric.totalLatency / metric.count : 0,
        errorRate: metric.count > 0 ? (metric.errors / metric.count) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get slowest endpoints
   */
  getSlowestEndpoints(limit = 10): Array<{
    endpoint: string;
    avgLatency: number;
    count: number;
  }> {
    return [...this.apiMetrics.entries()]
      .filter(([, metric]) => metric.count >= 5) // Minimum sample size
      .map(([endpoint, metric]) => ({
        endpoint,
        avgLatency: metric.totalLatency / metric.count,
        count: metric.count,
      }))
      .sort((a, b) => b.avgLatency - a.avgLatency)
      .slice(0, limit);
  }

  /**
   * Get error-prone endpoints
   */
  getErrorProneEndpoints(limit = 10): Array<{
    endpoint: string;
    errorRate: number;
    errorCount: number;
    totalCount: number;
  }> {
    return [...this.apiMetrics.entries()]
      .filter(([, metric]) => metric.errors > 0)
      .map(([endpoint, metric]) => ({
        endpoint,
        errorRate: (metric.errors / metric.count) * 100,
        errorCount: metric.errors,
        totalCount: metric.count,
      }))
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, limit);
  }

  /**
   * Get feature usage stats
   */
  getFeatureUsage(): Array<{
    feature: string;
    totalUses: number;
    uniqueUsers: number;
    lastUsed: string;
  }> {
    return [...this.featureMetrics.entries()]
      .map(([feature, metric]) => ({
        feature,
        totalUses: metric.count,
        uniqueUsers: metric.uniqueUsers.size,
        lastUsed: new Date(metric.lastUsed).toISOString(),
      }))
      .sort((a, b) => b.totalUses - a.totalUses);
  }

  /**
   * Get time series data for charts
   */
  getTimeSeries(): TimeSeriesPoint[] {
    return [...this.timeSeries];
  }

  /**
   * Get full dashboard data
   */
  getDashboardData() {
    return {
      overview: this.getOverview(),
      topEndpoints: this.getTopEndpoints(10),
      slowestEndpoints: this.getSlowestEndpoints(5),
      errorProneEndpoints: this.getErrorProneEndpoints(5),
      featureUsage: this.getFeatureUsage(),
      timeSeries: this.getTimeSeries(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Aggregate current metrics into time series point
   */
  private aggregateTimeSeries(): void {
    const overview = this.getOverview();

    const point: TimeSeriesPoint = {
      timestamp: Date.now(),
      requests: this.totalRequests,
      errors: this.totalErrors,
      avgLatency: this.calculateAverageLatency(),
      activeUsers: overview.activeUsers,
    };

    this.timeSeries.push(point);

    // Keep only last N points
    if (this.timeSeries.length > this.MAX_TIME_SERIES_POINTS) {
      this.timeSeries.shift();
    }
  }

  /**
   * Calculate overall average latency
   */
  private calculateAverageLatency(): number {
    let totalLatency = 0;
    let totalCount = 0;

    for (const metric of this.apiMetrics.values()) {
      totalLatency += metric.totalLatency;
      totalCount += metric.count;
    }

    return totalCount > 0 ? totalLatency / totalCount : 0;
  }

  /**
   * Evict oldest endpoint metrics (LRU)
   */
  private evictOldestEndpointMetrics(): void {
    // Remove oldest 10% of entries
    const toRemove = Math.floor(MAX_ENDPOINT_METRICS * 0.1);
    const entries = [...this.apiMetrics.entries()]
      .sort((a, b) => a[1].lastUpdated - b[1].lastUpdated)
      .slice(0, toRemove);

    for (const [key] of entries) {
      this.apiMetrics.delete(key);
    }
  }

  /**
   * Evict oldest feature metrics (LRU)
   */
  private evictOldestFeatureMetrics(): void {
    // Remove oldest 10% of entries
    const toRemove = Math.floor(MAX_FEATURE_METRICS * 0.1);
    const entries = [...this.featureMetrics.entries()]
      .sort((a, b) => a[1].lastUsed - b[1].lastUsed)
      .slice(0, toRemove);

    for (const [key] of entries) {
      this.featureMetrics.delete(key);
    }
  }

  /**
   * Cleanup old data
   */
  private cleanup(): void {
    const now = Date.now();

    // Remove inactive users
    const cutoff = now - this.ACTIVE_USER_WINDOW_MS;
    for (const [userId, lastSeen] of this.activeUsers) {
      if (lastSeen < cutoff) {
        this.activeUsers.delete(userId);
      }
    }

    // Clear unique users from old feature metrics (reset hourly)
    const hourAgo = now - 60 * 60 * 1000;
    for (const [, metric] of this.featureMetrics) {
      if (metric.lastUsed < hourAgo) {
        metric.uniqueUsers.clear();
      }
    }
  }

  /**
   * Start periodic cleanup and aggregation
   */
  private startCleanup(): void {
    if (this.cleanupInterval) return;

    // Cleanup every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);

    // Aggregate time series every hour
    setInterval(() => {
      this.aggregateTimeSeries();
    }, 60 * 60 * 1000);

    // Initial aggregation after 1 minute
    setTimeout(() => {
      this.aggregateTimeSeries();
    }, 60 * 1000);

    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * Reset all metrics (for testing)
   */
  reset(): void {
    this.apiMetrics.clear();
    this.featureMetrics.clear();
    this.activeUsers.clear();
    this.timeSeries = [];
    this.totalRequests = 0;
    this.totalErrors = 0;
    this.startTime = Date.now();
  }
}

// Singleton instance
export const metrics = new MetricsCollector();

// Feature tracking constants
export const FEATURES = {
  CHALLENGE_SUBMIT: 'challenge_submit',
  CHALLENGE_VALIDATE: 'challenge_validate',
  AI_HINT: 'ai_hint',
  AI_COMPANION: 'ai_companion',
  AI_FEEDBACK: 'ai_feedback',
  INTERVIEW_START: 'interview_start',
  INTERVIEW_COMPLETE: 'interview_complete',
  LEARNING_LESSON: 'learning_lesson',
  LEARNING_QUIZ: 'learning_quiz',
  LEARNING_CHAT: 'learning_chat',
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
} as const;

/**
 * Middleware helper to track API requests
 * Usage in API routes:
 *
 * const startTime = Date.now();
 * // ... handle request ...
 * trackAPIRequest(request, response.status, Date.now() - startTime, userId);
 */
export function trackAPIRequest(
  request: Request,
  statusCode: number,
  latencyMs: number,
  userId?: string
): void {
  const url = new URL(request.url);
  const endpoint = url.pathname;
  const method = request.method;

  metrics.trackRequest(endpoint, method, latencyMs, statusCode, userId);
}
