'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '../tool-layout';

interface LoadingItem {
  id: string;
  label: string;
  delay: number;
  loaded: boolean;
  content: string;
}

const items: Omit<LoadingItem, 'loaded'>[] = [
  { id: 'header', label: 'Header Banner', delay: 500, content: 'Welcome to the Slow Page Demo!' },
  { id: 'profile', label: 'User Profile', delay: 1500, content: 'John Doe — Senior QA Engineer' },
  { id: 'stats', label: 'Statistics Widget', delay: 2500, content: '42 tests passed | 3 failed | 98.6% pass rate' },
  { id: 'chart', label: 'Performance Chart', delay: 3500, content: '██████████████░░ 87% — Response Time: 230ms avg' },
  { id: 'table', label: 'Recent Results Table', delay: 4500, content: 'Login Test ✓ | Cart Test ✓ | Checkout Test ✗ | Search Test ✓' },
  { id: 'notifications', label: 'Notifications Panel', delay: 5500, content: '3 new alerts: Build #142 passed, Deploy scheduled, Review requested' },
];

export default function SlowResourcesTool() {
  const [loadingState, setLoadingState] = useState<Map<string, boolean>>(new Map());
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);

  const allLoaded = items.every((item) => loadingState.get(item.id));

  const startLoading = () => {
    setStarted(true);
    setLoadingState(new Map());
    const now = Date.now();
    setStartTime(now);

    items.forEach((item) => {
      setTimeout(() => {
        setLoadingState((prev) => {
          const next = new Map(prev);
          next.set(item.id, true);
          return next;
        });
      }, item.delay);
    });
  };

  // Elapsed timer
  useEffect(() => {
    if (!started || allLoaded) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);
    return () => clearInterval(interval);
  }, [started, allLoaded, startTime]);

  useEffect(() => {
    if (allLoaded && started) {
      setElapsed(Date.now() - startTime);
    }
  }, [allLoaded, started, startTime]);

  const handleReset = () => {
    setStarted(false);
    setLoadingState(new Map());
    setElapsed(0);
  };

  const loadedCount = items.filter((item) => loadingState.get(item.id)).length;

  return (
    <ToolLayout
      title="Slow Loading Page"
      description="Elements that appear at different times with random delays. Practice waitFor strategies, timeouts, and loading state handling."
      difficulty="Beginner"
      scenarios={[
        'Click "Load Page" and wait for the header to appear first (500ms).',
        'Wait for all 6 elements to load and verify the "All loaded" message.',
        'Verify each element appears in the correct order.',
        'Use waitForSelector to wait for a specific element by data-testid.',
        'Verify the elapsed time counter stops after all elements load.',
        'Use expect(locator).toBeVisible({ timeout: 6000 }) for the last element.',
        'Reset and reload — verify all elements disappear and reload.',
        'Count loaded vs skeleton elements at any point during loading.',
      ]}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {started ? (
              <span data-testid="load-status">
                Loaded: {loadedCount}/{items.length}
                {allLoaded ? ' — All loaded!' : ' — Loading...'}
              </span>
            ) : (
              <span>Click "Load Page" to start</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {started && (
              <span className="text-xs font-mono text-slate-500" data-testid="elapsed-time">
                {(elapsed / 1000).toFixed(1)}s
              </span>
            )}
            {!started ? (
              <button onClick={startLoading} className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700" data-testid="start-button">
                Load Page
              </button>
            ) : (
              <button onClick={handleReset} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50" data-testid="reset-button">
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {started && (
          <div className="w-full bg-slate-200 rounded-full h-2" data-testid="progress-bar">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${allLoaded ? 'bg-green-500' : 'bg-sky-500'}`}
              style={{ width: `${(loadedCount / items.length) * 100}%` }}
              data-testid="progress-fill"
            />
          </div>
        )}

        {/* Content Blocks */}
        {started && (
          <div className="space-y-4" data-testid="content-area">
            {items.map((item) => {
              const loaded = loadingState.get(item.id);
              return (
                <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden" data-testid={`block-${item.id}`}>
                  {/* Label */}
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-700">{item.label}</span>
                    <span className="text-xs text-slate-400">~{item.delay}ms</span>
                  </div>

                  {/* Content / Skeleton */}
                  <div className="px-4 py-4">
                    {loaded ? (
                      <p className="text-sm text-slate-800" data-testid={`content-${item.id}`}>
                        {item.content}
                      </p>
                    ) : (
                      <div className="space-y-2" data-testid={`skeleton-${item.id}`}>
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* All loaded message */}
        {allLoaded && started && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center" data-testid="all-loaded">
            <p className="text-sm font-semibold text-green-800">
              All elements loaded in {(elapsed / 1000).toFixed(1)} seconds!
            </p>
          </div>
        )}

        {/* Info */}
        {!started && (
          <div className="text-center py-16 text-slate-400 text-sm" data-testid="idle-state">
            Press &quot;Load Page&quot; to simulate a slow-loading page with staggered elements.
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
