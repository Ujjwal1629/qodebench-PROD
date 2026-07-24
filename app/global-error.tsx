'use client';

import { useEffect } from 'react';

// Root-level catch-all. It replaces the whole document when a render throws
// above the route boundaries, so it must render its own <html>/<body>.
//
// Main job: recover from a ChunkLoadError (the browser is holding an old build
// and requested a JS/CSS chunk that no longer exists — typical right after a
// deploy while a tab stays open). Reloading fetches the current build.

function isChunkLoadError(error: Error) {
  return (
    error.name === 'ChunkLoadError' ||
    /Loading chunk [\w-]+ failed/i.test(error.message) ||
    /Loading CSS chunk/i.test(error.message) ||
    /import\(\) failed/i.test(error.message)
  );
}

const RELOAD_FLAG = 'qb_chunk_reload_at';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const chunkError = isChunkLoadError(error);

  useEffect(() => {
    if (!chunkError) return;
    try {
      const last = Number(sessionStorage.getItem(RELOAD_FLAG) || 0);
      if (Date.now() - last > 10_000) {
        sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
        window.location.reload();
      }
    } catch {
      window.location.reload();
    }
  }, [error, chunkError]);

  return (
    <html>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          background: '#f8fafc',
          color: '#475569',
        }}
      >
        <div style={{ textAlign: 'center', padding: 24 }}>
          {chunkError ? (
            <>
              <div
                style={{
                  width: 24,
                  height: 24,
                  margin: '0 auto 12px',
                  borderRadius: '50%',
                  border: '2px solid #cbd5e1',
                  borderTopColor: '#0ea5e9',
                  animation: 'qbspin 0.7s linear infinite',
                }}
              />
              <p style={{ fontSize: 14 }}>Updating to the latest version…</p>
              <style>{'@keyframes qbspin{to{transform:rotate(360deg)}}'}</style>
            </>
          ) : (
            <>
              <h2 style={{ color: '#0f172a', fontSize: 22, margin: '0 0 8px' }}>
                Something went wrong
              </h2>
              <p style={{ fontSize: 14, margin: '0 0 16px' }}>
                Please try again.
              </p>
              <button
                onClick={() => reset()}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#0ea5e9',
                  color: '#fff',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
            </>
          )}
        </div>
      </body>
    </html>
  );
}
