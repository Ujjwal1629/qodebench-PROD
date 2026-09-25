'use client';

import { useEffect, useRef, useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import type { MuxPlayerRefAttributes } from '@mux/mux-player-react';
import { Play, Loader2, ListVideo } from 'lucide-react';
import { getCSRFHeaders } from '@/lib/utils/csrf-client';
import { parseTimestamp, type VideoChapter } from '@/lib/course-content/ai-testing-videos';

interface LessonVideoProps {
  /** Mux playback ID for this session, or undefined if no video yet. */
  playbackId?: string;
  /** Session title, shown on the placeholder and used as the player's video title. */
  title: string;
  /** Topic timestamps for full-session recordings; empty/undefined = no chapter UI. */
  chapters?: VideoChapter[];
}

type TokenState =
  | { status: 'loading' }
  | { status: 'ready'; tokens: Record<string, string> | null }
  | { status: 'error' };

export function LessonVideo({ playbackId, title, chapters = [] }: LessonVideoProps) {
  const [token, setToken] = useState<TokenState>({ status: 'loading' });
  const playerRef = useRef<MuxPlayerRefAttributes>(null);

  const validChapters = chapters
    .map((c) => ({ ...c, seconds: parseTimestamp(c.time) }))
    .filter((c): c is VideoChapter & { seconds: number } => c.seconds !== null);

  useEffect(() => {
    if (!playbackId) return;
    let cancelled = false;
    setToken({ status: 'loading' });

    fetch('/api/courses/video-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getCSRFHeaders() },
      body: JSON.stringify({ playbackId }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`token ${res.status}`);
        const data = await res.json();
        if (!cancelled) setToken({ status: 'ready', tokens: data.tokens ?? null });
      })
      .catch(() => {
        if (!cancelled) setToken({ status: 'error' });
      });

    return () => {
      cancelled = true;
    };
  }, [playbackId]);

  // Mux requires chapters to be registered after the media's metadata is loaded.
  const registerChapters = () => {
    if (!validChapters.length) return;
    playerRef.current?.addChapters(
      validChapters.map((c) => ({ startTime: c.seconds, value: c.title }))
    );
  };

  const seekTo = (seconds: number) => {
    const player = playerRef.current;
    if (!player) return;
    player.currentTime = seconds;
    player.play();
  };

  // No video uploaded for this session yet — keep the original placeholder.
  if (!playbackId) {
    return (
      <div className="relative aspect-video max-h-[52vh] w-full mx-auto flex flex-col items-center justify-center gap-3">
        <div className="h-14 w-14 rounded-full bg-white/95 flex items-center justify-center shadow-xl">
          <Play className="h-5 w-5 text-slate-950 ml-0.5" fill="currentColor" />
        </div>
        <p className="text-[0.7812rem] text-slate-500 px-6 text-center">
          Recording coming soon — {title}
        </p>
      </div>
    );
  }

  if (token.status === 'loading') {
    return (
      <div className="relative aspect-video max-h-[52vh] w-full mx-auto flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-slate-500 animate-spin" />
      </div>
    );
  }

  if (token.status === 'error') {
    return (
      <div className="relative aspect-video max-h-[52vh] w-full mx-auto flex items-center justify-center px-6">
        <p className="text-[0.7812rem] text-slate-400 text-center">
          Couldn&apos;t load this recording. Refresh the page, or contact support if it persists.
        </p>
      </div>
    );
  }

  return (
    <div>
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        tokens={token.tokens ?? undefined}
        metadata={{ video_title: title }}
        accentColor="#0ea5e9"
        streamType="on-demand"
        className="aspect-video max-h-[52vh] w-full"
        onLoadedMetadata={registerChapters}
      />

      {validChapters.length > 0 && (
        <div className="px-4 lg:px-5 py-2.5 border-t border-white/10">
          <div className="flex items-center gap-1.5 mb-2 text-slate-400">
            <ListVideo className="h-3.5 w-3.5" />
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wide">
              In this session
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1.5 -mb-1.5">
            {validChapters.map((chapter) => (
              <button
                key={chapter.time}
                onClick={() => seekTo(chapter.seconds)}
                className="flex items-center gap-2 shrink-0 rounded-md bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 px-2.5 py-1.5 transition-colors"
              >
                <span className="text-[0.6875rem] font-mono font-semibold text-sky-400">
                  {chapter.time}
                </span>
                <span className="text-[0.75rem] text-slate-200 whitespace-nowrap">
                  {chapter.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
