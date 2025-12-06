import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for Server Components and Route Handlers.
 * Uses the anon key and respects Row Level Security (RLS) policies.
 * User authentication is handled via cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Creates a Supabase client with Service Role privileges.
 * BYPASSES Row Level Security (RLS) policies - use with extreme caution!
 *
 * Use cases:
 * - Webhook handlers that need to update data without user context
 * - Admin operations that require elevated permissions
 * - Background jobs and scheduled tasks
 * - System-level operations (e.g., cleanup, migrations)
 *
 * Security notes:
 * - NEVER expose this client to the browser or client-side code
 * - NEVER use user-provided data directly in queries
 * - ALWAYS validate and sanitize inputs
 * - Only use in server-side Route Handlers and Server Actions
 * - Log all operations for audit trail
 *
 * @returns Supabase client with service role privileges
 */
export async function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in environment variables.'
    );
  }

  // Service role client doesn't need cookie handling as it bypasses auth
  return createServerClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No-op for service role client
        },
      },
    }
  );
}
