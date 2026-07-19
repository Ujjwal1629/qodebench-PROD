import { NextRequest, NextResponse } from 'next/server';
import Mux from '@mux/mux-node';
import { getSubscription } from '@/lib/get-subscription';

// Issues a short-lived signed playback token for a Mux video, but only to an
// enrolled (subscribed) user. This is what stops a non-paying user from copying
// a playback URL and watching for free.
//
// Requires three server-side env vars (see .env.local):
//   MUX_TOKEN_ID, MUX_TOKEN_SECRET       — API access token (any Mux API call)
//   MUX_SIGNING_KEY, MUX_SIGNING_PRIVATE_KEY — a "signing key" pair, for JWTs
//
// If the signing key isn't configured, the playback ID is assumed PUBLIC and we
// return no token (the player then plays it unsigned). That lets you test with a
// public playback ID before wiring up signed playback.

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { isEnrolled } = await getSubscription();
  if (!isEnrolled) {
    return NextResponse.json({ error: 'Not enrolled' }, { status: 403 });
  }

  let playbackId: string | undefined;
  try {
    ({ playbackId } = await req.json());
  } catch {
    // ignore — handled below
  }
  if (!playbackId) {
    return NextResponse.json({ error: 'Missing playbackId' }, { status: 400 });
  }

  const signingKey = process.env.MUX_SIGNING_KEY;
  const signingSecret = process.env.MUX_SIGNING_PRIVATE_KEY;

  // Public playback ID path: no signing configured → no token needed.
  if (!signingKey || !signingSecret) {
    return NextResponse.json({ tokens: null });
  }

  try {
    const mux = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
    });

    const opts = { keyId: signingKey, keySecret: signingSecret, expiration: '3h' };

    // Sign each token type separately so the response keys match MuxPlayer's
    // `tokens` prop exactly ({ playback, thumbnail, storyboard }). The array form
    // of signPlaybackId returns different keys ("playback-token"), which the
    // player ignores — so keep these as three explicit calls.
    const [playback, thumbnail, storyboard] = await Promise.all([
      mux.jwt.signPlaybackId(playbackId, { ...opts, type: 'video' }),
      mux.jwt.signPlaybackId(playbackId, { ...opts, type: 'thumbnail' }),
      mux.jwt.signPlaybackId(playbackId, { ...opts, type: 'storyboard' }),
    ]);

    return NextResponse.json({ tokens: { playback, thumbnail, storyboard } });
  } catch (err) {
    console.error('Mux token signing failed:', err);
    return NextResponse.json({ error: 'Could not sign playback token' }, { status: 500 });
  }
}
