import Link from 'next/link';
import { ArrowRight, GraduationCap, PlayCircle } from 'lucide-react';
import { COURSE_HREF, COURSE_NAME } from '@/lib/public-tools';

/** "Want to go deeper? Join the course" box, used on tool pages and blog posts. */
export function CourseCta({ sessions, heading }: { sessions: string[]; heading?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-slate-950 text-white">
      <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="mb-3 flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-brand-300">
            <GraduationCap className="h-4 w-4" /> Go deeper
          </p>
          <h2 className="font-serif text-3xl leading-tight tracking-tight sm:text-[2.125rem]">
            {heading ?? 'This is one small piece of real AI testing.'}
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-slate-300">
            In the <span className="font-semibold text-white">{COURSE_NAME}</span> course you learn it properly:
            recorded sessions, theory notes, hands-on practice on tools like this one, and live doubt-clearing
            every weekend.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={COURSE_HREF}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
            >
              View the course <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Sign up free
            </Link>
          </div>
        </div>
        {sessions.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="mb-4 text-sm font-semibold text-slate-200">Sessions that cover this</p>
            <ul className="space-y-3">
              {sessions.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm leading-snug text-slate-300">
                  <PlayCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
