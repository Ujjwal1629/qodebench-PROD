import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimiter, getRateLimitIdentifier } from '@/lib/utils/rate-limiter';

type GuestLimit = 'publicHallucination' | 'publicRag';

/**
 * Rate limiting for AI testing tools that are open to visitors who aren't
 * signed in (/testing-tools/*).
 *
 * - Signed-in users get the normal AI limit.
 * - Guests get a small hourly allowance per IP, plus a shared ceiling across
 *   all guests. When they run out, the 429 carries `signupRequired: true` so the
 *   tool shows a "Sign up free" prompt instead of an error.
 *
 * Note: the limiter is in-memory (per server instance). It caps casual abuse,
 * not a determined attacker; move to the Upstash limiter for a hard guarantee.
 */
export async function guardPublicTool(
  request: Request,
  guestLimit: GuestLimit
): Promise<{ isGuest: boolean; limited: NextResponse | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const r = rateLimiter.check(getRateLimitIdentifier(user.id), 'ai');
    return {
      isGuest: false,
      limited: r.limited
        ? NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 })
        : null,
    };
  }

  const perIp = rateLimiter.check(getRateLimitIdentifier(null, request), guestLimit);
  const total = perIp.limited ? perIp : rateLimiter.check('all-guests', 'publicGuestsTotal');

  if (perIp.limited || total.limited) {
    return {
      isGuest: true,
      limited: NextResponse.json(
        {
          error: perIp.limited
            ? "You've used your free runs for this hour. Sign up free to keep testing, it takes 30 seconds."
            : 'The free tools are busy right now. Sign up free to keep testing without waiting.',
          signupRequired: true,
        },
        { status: 429 }
      ),
    };
  }

  return { isGuest: true, limited: null };
}
