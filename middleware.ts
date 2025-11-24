import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import {
  generateCSRFToken,
  setCSRFCookie,
  validateCSRFRequest,
  csrfErrorResponse,
  isCSRFExempt,
} from '@/lib/utils/csrf';

export async function middleware(request: NextRequest) {
  // First, run session update
  const response = await updateSession(request);

  // If updateSession returned a redirect, return it
  if (response.status >= 300 && response.status < 400) {
    return response;
  }

  const pathname = request.nextUrl.pathname;

  // Skip CSRF for exempt paths (webhooks, health checks, etc.)
  if (isCSRFExempt(pathname)) {
    return response;
  }

  // For GET requests to protected pages, ensure CSRF cookie is set
  if (request.method === 'GET' && !request.cookies.get('__csrf_token')) {
    const token = generateCSRFToken();
    return setCSRFCookie(response, token);
  }

  // For API routes with state-changing methods, validate CSRF
  if (pathname.startsWith('/api/') && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const csrfResult = validateCSRFRequest(request);

    if (!csrfResult.valid) {
      // Log CSRF failures for security monitoring
      console.warn('[SECURITY] CSRF validation failed:', csrfResult.error, {
        path: pathname,
        method: request.method,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });
      return csrfErrorResponse();
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
