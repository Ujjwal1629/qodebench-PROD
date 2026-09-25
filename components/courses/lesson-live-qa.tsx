'use client';

import { CalendarClock, Video, GraduationCap, MessageSquareText } from 'lucide-react';

interface LessonLiveQAProps {
  title: string;
}

// Two flavours of live session: course/session doubt-clearing, and career
// counseling. Both are scheduled — dates are announced closer to the date.
export function LessonLiveQA({ title }: LessonLiveQAProps) {
  const isCareer = /career/i.test(title);
  const Icon = isCareer ? GraduationCap : MessageSquareText;

  const blurb = isCareer
    ? 'A live career-counseling session — we discuss AI-testing roles, how to position your portfolio, résumé and interview prep, and answer your individual career questions.'
    : 'A live Q&A to clear doubts from the recorded sessions — bring your questions on the concepts, tools and assignments, and we work through them together on the call.';

  return (
    <div className="px-6 lg:px-8 py-8">
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-[1rem] font-bold text-slate-950 leading-snug">{title}</h2>
            <p className="text-[0.7812rem] text-slate-500">Live session</p>
          </div>
        </div>

        <p className="mt-5 text-[0.875rem] leading-relaxed text-slate-700">{blurb}</p>

        <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <CalendarClock className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-[0.8438rem] font-semibold text-amber-900">
              Schedule to be announced soon
            </p>
            <p className="text-[0.7812rem] text-amber-800/90 leading-snug">
              The date, time and joining link will be shared here and in your student group
              before the session.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-[0.7812rem] text-slate-500">
          <Video className="h-4 w-4 text-slate-400" />
          Held live over video · recording added here afterwards
        </div>
      </div>
    </div>
  );
}
