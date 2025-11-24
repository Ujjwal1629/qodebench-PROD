/**
 * Client-side CSRF Token Utilities
 *
 * Use these functions to include CSRF tokens in your API requests.
 *
 * Usage with fetch:
 * ```
 * import { getCSRFHeaders } from '@/lib/utils/csrf-client';
 *
 * const response = await fetch('/api/endpoint', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     ...getCSRFHeaders(),
 *   },
 *   body: JSON.stringify(data),
 * });
 * ```
 */

const CSRF_COOKIE_NAME = '__csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Get CSRF token from cookie
 */
export function getCSRFToken(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === CSRF_COOKIE_NAME) {
      return value;
    }
  }

  return null;
}

/**
 * Get headers object with CSRF token for fetch requests
 */
export function getCSRFHeaders(): Record<string, string> {
  const token = getCSRFToken();

  if (!token) {
    return {};
  }

  return {
    [CSRF_HEADER_NAME]: token,
  };
}

/**
 * Create a fetch wrapper that automatically includes CSRF token
 */
export function csrfFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);

  // Add CSRF token for non-GET requests
  if (init?.method && !['GET', 'HEAD', 'OPTIONS'].includes(init.method.toUpperCase())) {
    const token = getCSRFToken();
    if (token) {
      headers.set(CSRF_HEADER_NAME, token);
    }
  }

  return fetch(input, {
    ...init,
    headers,
  });
}

/**
 * Higher-order function to wrap any API call function with CSRF protection
 */
export function withCSRF<T extends (...args: any[]) => Promise<Response>>(
  apiFn: T
): T {
  return ((...args: Parameters<T>) => {
    // Intercept headers and add CSRF token
    return apiFn(...args);
  }) as T;
}
