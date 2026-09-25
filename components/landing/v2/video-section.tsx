import { Play } from "lucide-react";

// Set this to your YouTube video ID (e.g. "dQw4w9WgXcQ") to show the real player.
const YOUTUBE_VIDEO_ID = "";

export function VideoSection() {
  return (
    <section className="bg-white py-20 lg:py-24 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[0.8125rem] font-semibold tracking-[0.16em] uppercase text-brand-600 mb-4">
            See It For Yourself
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-slate-950 tracking-tight mb-4">
            How a lesson works on QodeBench
          </h2>
          <p className="text-[1rem] text-slate-600 leading-relaxed">
            Video on one side, theory on the other, your doubts answered underneath —
            watch a two-minute walkthrough of the course experience.
          </p>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)]">
          {YOUTUBE_VIDEO_ID ? (
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?rel=0`}
                title="How QodeBench courses work"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center gap-5">
              <button
                type="button"
                aria-label="Play walkthrough video"
                className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
              >
                <Play className="h-8 w-8 text-slate-950 ml-1" fill="currentColor" />
              </button>
              <p className="text-[0.875rem] text-slate-400">Course walkthrough · 2 min</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
