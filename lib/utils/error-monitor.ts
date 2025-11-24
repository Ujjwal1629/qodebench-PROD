/**
 * Error Monitoring Utility
 *
 * Provides centralized error tracking and reporting.
 * In production, this can be easily extended to integrate with:
 * - Sentry
 * - LogRocket
 * - Datadog
 * - Custom error tracking service
 *
 * For now, it provides:
 * - Structured error logging
 * - Error deduplication (prevents log spam)
 * - Error context enrichment
 * - Client-side error boundary support
 */

import { logger } from './logger';

interface ErrorContext {
  userId?: string;
  requestId?: string;
  path?: string;
  action?: string;
  component?: string;
  metadata?: Record<string, any>;
}

interface TrackedError {
  count: number;
  firstSeen: Date;
  lastSeen: Date;
}

// Track recent errors to prevent spam (in-memory for this instance)
const recentErrors = new Map<string, TrackedError>();
const MAX_TRACKED_ERRORS = 100;
const ERROR_DEDUPE_WINDOW_MS = 60 * 1000; // 1 minute

/**
 * Generate a fingerprint for an error to deduplicate
 */
function getErrorFingerprint(error: Error, context?: ErrorContext): string {
  const parts = [
    error.name,
    error.message,
    context?.path || '',
    context?.action || '',
  ];
  return parts.join('|');
}

/**
 * Check if error should be logged (deduplication)
 */
function shouldLogError(fingerprint: string): boolean {
  const tracked = recentErrors.get(fingerprint);
  const now = new Date();

  if (!tracked) {
    // First occurrence
    recentErrors.set(fingerprint, {
      count: 1,
      firstSeen: now,
      lastSeen: now,
    });

    // Cleanup old entries if needed
    if (recentErrors.size > MAX_TRACKED_ERRORS) {
      const oldest = [...recentErrors.entries()]
        .sort((a, b) => a[1].lastSeen.getTime() - b[1].lastSeen.getTime())
        .slice(0, MAX_TRACKED_ERRORS / 2);
      oldest.forEach(([key]) => recentErrors.delete(key));
    }

    return true;
  }

  // Update tracking
  tracked.count++;
  tracked.lastSeen = now;

  // Log every 10th occurrence or if it's been a while
  const timeSinceFirst = now.getTime() - tracked.firstSeen.getTime();
  if (tracked.count % 10 === 0 || timeSinceFirst > ERROR_DEDUPE_WINDOW_MS) {
    tracked.firstSeen = now;
    tracked.count = 1;
    return true;
  }

  return false;
}

/**
 * Capture and track an error
 */
export function captureError(
  error: Error | string,
  context?: ErrorContext
): void {
  const err = typeof error === 'string' ? new Error(error) : error;
  const fingerprint = getErrorFingerprint(err, context);

  if (!shouldLogError(fingerprint)) {
    return; // Skip duplicate
  }

  // Log the error
  logger.error(`[ERROR] ${err.message}`, {
    ...context,
    errorName: err.name,
    stack: err.stack,
  }, err);

  // In production, send to external service
  if (process.env.NODE_ENV === 'production') {
    sendToErrorService(err, context);
  }
}

/**
 * Capture an API error with request context
 */
export function captureAPIError(
  error: Error | string,
  request: {
    method?: string;
    path: string;
    userId?: string;
  }
): void {
  captureError(error, {
    userId: request.userId,
    path: request.path,
    action: `${request.method || 'UNKNOWN'} ${request.path}`,
  });
}

/**
 * Capture a client-side error (from error boundaries, etc.)
 */
export function captureClientError(
  error: Error,
  componentStack?: string,
  context?: ErrorContext
): void {
  captureError(error, {
    ...context,
    component: componentStack?.split('\n')[1]?.trim() || 'Unknown',
    metadata: {
      ...context?.metadata,
      componentStack,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    },
  });
}

/**
 * Send error to external monitoring service
 * Placeholder for integration with Sentry, LogRocket, etc.
 */
function sendToErrorService(error: Error, context?: ErrorContext): void {
  // Placeholder for external service integration
  // Examples:
  //
  // Sentry:
  // Sentry.captureException(error, { extra: context });
  //
  // Custom API:
  // fetch('/api/errors', {
  //   method: 'POST',
  //   body: JSON.stringify({ error: error.message, stack: error.stack, context }),
  // });

  // For now, we rely on structured logging
  // The logs can be picked up by log aggregation services
}

/**
 * Create an error boundary handler
 * Use this in React error boundaries
 */
export function createErrorBoundaryHandler(componentName: string) {
  return (error: Error, errorInfo: { componentStack?: string }) => {
    captureClientError(error, errorInfo.componentStack, {
      component: componentName,
    });
  };
}

/**
 * Wrap an async function with error capture
 */
export function withErrorCapture<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), context);
      throw error;
    }
  }) as T;
}

/**
 * Get error monitoring stats (for debugging/health checks)
 */
export function getErrorStats(): {
  trackedErrors: number;
  recentErrors: Array<{ fingerprint: string; count: number; lastSeen: Date }>;
} {
  return {
    trackedErrors: recentErrors.size,
    recentErrors: [...recentErrors.entries()]
      .map(([fingerprint, data]) => ({
        fingerprint: fingerprint.slice(0, 50),
        count: data.count,
        lastSeen: data.lastSeen,
      }))
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
      .slice(0, 10),
  };
}
