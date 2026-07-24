'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

// A ChunkLoadError means the browser is holding an old build and asked for a JS
// chunk that no longer exists (typical right after a deploy while a tab stays
// open, or after a dev rebuild). The fix is to reload so the browser fetches
// the current build instead of showing a scary error.
function isChunkLoadError(error: Error) {
  return (
    error.name === 'ChunkLoadError' ||
    /Loading chunk [\w-]+ failed/i.test(error.message) ||
    /Loading CSS chunk/i.test(error.message) ||
    /import\(\) failed/i.test(error.message)
  );
}

// Guard against a reload loop: only auto-reload once per stale-chunk episode.
const RELOAD_FLAG = 'qb_chunk_reload_at';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const chunkError = isChunkLoadError(error);

  useEffect(() => {
    console.error('Dashboard error:', error);

    if (!chunkError) return;

    // Reload at most once every 10s so a genuinely broken build can't loop.
    try {
      const last = Number(sessionStorage.getItem(RELOAD_FLAG) || 0);
      if (Date.now() - last > 10_000) {
        sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
        window.location.reload();
      }
    } catch {
      // sessionStorage unavailable — fall back to a plain reload.
      window.location.reload();
    }
  }, [error, chunkError]);

  // While the auto-reload kicks in, show a neutral "updating" state rather than
  // the scary error card.
  if (chunkError) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
          <p className="text-sm text-slate-600">Updating to the latest version…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[600px] items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Something went wrong!
              </h2>
              <p className="text-slate-600">
                We encountered an error while loading your dashboard. Please try again.
              </p>
              {error.digest && (
                <p className="text-xs text-slate-500">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={reset}>Try Again</Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = '/')}
              >
                Go Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
