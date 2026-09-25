'use client';

import { Lock, Mic, CheckCircle2, ArrowRight } from 'lucide-react';

interface LessonMockInterviewProps {
  title: string;
  unlocked: boolean;
  phaseName: string;
}

export function LessonMockInterview({ title, unlocked, phaseName }: LessonMockInterviewProps) {
  return (
    <div className="px-6 lg:px-8 py-8">
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span
            className={
              'flex h-11 w-11 items-center justify-center rounded-xl ' +
              (unlocked ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-400')
            }
          >
            {unlocked ? <Mic className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </span>
          <div>
            <h2 className="text-[1rem] font-bold text-slate-950 leading-snug">{title}</h2>
            <p className="text-[0.7812rem] text-slate-500">
              {unlocked ? 'Ready to start' : `Locked · unlocks when ${phaseName} is complete`}
            </p>
          </div>
        </div>

        <p className="mt-5 text-[0.875rem] leading-relaxed text-slate-700">
          A live, AI-evaluated mock interview covering everything from this phase — LLM
          fundamentals, prompt testing, PromptFoo, DeepEval, hallucination detection and RAG.
          You&apos;ll answer real interview questions and receive a scored performance report.
        </p>

        {unlocked ? (
          <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-[0.8438rem] font-semibold text-white hover:bg-brand-700 transition-colors">
            Start mock interview
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <>
            <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Lock className="h-5 w-5 text-slate-400 shrink-0" />
              <p className="text-[0.8125rem] text-slate-600 leading-snug">
                Complete all sessions and practice sets in{' '}
                <span className="font-semibold text-slate-800">{phaseName}</span> to unlock the
                mock interview.
              </p>
            </div>

            <div className="mt-5">
              <p className="text-[0.75rem] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                What you&apos;ll be assessed on
              </p>
              <ul className="space-y-1.5">
                {[
                  'Explaining hallucination, non-determinism and prompt injection',
                  'Designing tests with PromptFoo and DeepEval',
                  'Reasoning about RAG metrics and model comparison',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[0.8125rem] text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-slate-300 shrink-0 mt-px" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
