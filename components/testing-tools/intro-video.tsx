'use client';

import MuxPlayer from '@mux/mux-player-react';

/**
 * Short intro/walkthrough video on a public tool page. Unlike course lessons
 * (LessonVideo), these are PUBLIC Mux playback IDs, so no token is fetched and
 * anyone can watch, signed in or not.
 */
export function IntroVideo({ playbackId, title }: { playbackId: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm">
      <MuxPlayer
        playbackId={playbackId}
        streamType="on-demand"
        metadata={{ video_title: title }}
        accentColor="#0ea5e9"
        className="aspect-video w-full"
      />
    </div>
  );
}
