'use client';

import { useState } from 'react';
import { Dumbbell, Check, X, HelpCircle, Lightbulb, Loader2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCSRFHeaders } from '@/lib/utils/csrf-client';
import type { PracticeSet, PracticeTask } from '@/lib/course-content/ai-testing-practice';

interface LessonPracticeProps {
  title: string;
  courseSlug: string;
  set?: PracticeSet;
}

type Answer = number[] | string; // multi/mcq → indices; text kinds → string

// Reflection & lab are open-ended: self-checked against a model answer, not
// right/wrong scored. Everything else is auto-graded.
const SELF_CHECK = (k: PracticeTask['kind']) => k === 'reflection' || k === 'lab';

// Deterministic client-side grading for auto-graded tasks.
function gradeTask(task: PracticeTask, answer: Answer | undefined): boolean {
  if (answer === undefined) return false;
  if (task.kind === 'mcq' || task.kind === 'multi') {
    const picked = (answer as number[]) ?? [];
    const correct = task.correct ?? [];
    if (picked.length !== correct.length) return false;
    return correct.every((c) => picked.includes(c));
  }
  // short / code
  const text = String(answer).trim();
  if (task.minLength && text.length < task.minLength) return false;
  const needles = task.mustInclude ?? [];
  const lower = text.toLowerCase();
  return needles.every((n) => lower.includes(n.toLowerCase()));
}

// A self-check task counts as "completed" when the learner wrote a real answer.
function completedSelfCheck(task: PracticeTask, answer: Answer | undefined): boolean {
  const text = String(answer ?? '').trim();
  return text.length >= (task.minLength ?? 1);
}

export function LessonPractice({ title, courseSlug, set }: LessonPracticeProps) {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [graded, setGraded] = useState(false);
  const [hints, setHints] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!set) {
    return (
      <div className="px-6 lg:px-8 py-6">
        <PracticeHeader />
        <div className="max-w-2xl rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-8 text-center">
          <p className="text-[14px] font-semibold text-slate-800">
            Practice for this lesson is on the way
          </p>
          <p className="mt-1.5 text-[13px] text-slate-500 leading-relaxed">
            Interactive, auto-graded tasks for{' '}
            <span className="font-medium text-slate-700">{title.replace(/^Practice:\s*/, '')}</span>{' '}
            will unlock here as this module&apos;s lessons go live.
          </p>
        </div>
      </div>
    );
  }

  const tasks = set.tasks;
  // Score is computed over AUTO-GRADED tasks only; self-check tasks are for
  // learning and don't count right/wrong.
  const autoTasks = tasks.filter((t) => !SELF_CHECK(t.kind));
  const passedCount = graded
    ? autoTasks.filter((t) => gradeTask(t, answers[t.id])).length
    : 0;
  const scorePct = autoTasks.length
    ? Math.round((passedCount / autoTasks.length) * 100)
    : 100; // an all-reflection assignment is "complete", not scored
  const passed = scorePct >= 70;
  const hasAuto = autoTasks.length > 0;

  const setMcq = (taskId: string, oi: number, multi: boolean) => {
    if (graded) return;
    setAnswers((prev) => {
      const cur = (prev[taskId] as number[]) ?? [];
      if (!multi) return { ...prev, [taskId]: [oi] };
      return {
        ...prev,
        [taskId]: cur.includes(oi) ? cur.filter((x) => x !== oi) : [...cur, oi],
      };
    });
  };

  const setText = (taskId: string, val: string) => {
    if (graded) return;
    setAnswers((prev) => ({ ...prev, [taskId]: val }));
  };

  const submit = async () => {
    setGraded(true);
    const pc = autoTasks.filter((t) => gradeTask(t, answers[t.id])).length;
    const pct = autoTasks.length ? Math.round((pc / autoTasks.length) * 100) : 100;
    // Persist the attempt (best-effort; grading already shown regardless).
    setSaving(true);
    try {
      const res = await fetch('/api/courses/practice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getCSRFHeaders() },
        body: JSON.stringify({
          courseSlug,
          itemTitle: title,
          answers,
          score: pct,
          passed: pct >= 70,
          totalTasks: autoTasks.length,
          passedTasks: pc,
        }),
      });
      if (res.ok) setSaved(true);
    } catch {
      /* non-blocking */
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setAnswers({});
    setGraded(false);
    setHints({});
    setSaved(false);
  };

  return (
    <div className="px-6 lg:px-8 py-6">
      <PracticeHeader />
      <p className="max-w-3xl text-[14px] leading-relaxed text-slate-600 mb-5">{set.intro}</p>

      <div className="max-w-3xl space-y-4">
        {tasks.map((task, ti) => {
          const selfCheck = SELF_CHECK(task.kind);
          const ok = graded && !selfCheck ? gradeTask(task, answers[task.id]) : undefined;
          const done = graded && selfCheck && completedSelfCheck(task, answers[task.id]);
          return (
            <div
              key={task.id}
              className={cn(
                'rounded-xl border p-4',
                !graded && 'border-slate-200',
                graded && selfCheck && 'border-brand-200 bg-brand-50/30',
                graded && !selfCheck && ok && 'border-emerald-200 bg-emerald-50/40',
                graded && !selfCheck && !ok && 'border-red-200 bg-red-50/30'
              )}
            >
              <div className="flex items-start gap-2">
                <span className="font-mono text-[12px] text-slate-400 mt-px shrink-0">
                  {ti + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-slate-900 leading-snug whitespace-pre-line">
                    {task.prompt}
                  </p>

                  {/* Lab steps: what to run in the learner's own AI tool */}
                  {task.kind === 'lab' && task.labSteps && (
                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                        Do this in your AI tool
                      </p>
                      <ol className="list-decimal pl-4 space-y-1 marker:text-slate-400">
                        {task.labSteps.map((step, si) => (
                          <li key={si} className="text-[12.5px] text-slate-600 leading-snug">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Answer input by kind */}
                  <div className="mt-3">
                    {task.kind === 'mcq' || task.kind === 'multi' ? (
                      <div className="space-y-2">
                        {task.options?.map((opt, oi) => {
                          const picked = ((answers[task.id] as number[]) ?? []).includes(oi);
                          const isCorrect = (task.correct ?? []).includes(oi);
                          return (
                            <button
                              key={oi}
                              onClick={() => setMcq(task.id, oi, task.kind === 'multi')}
                              disabled={graded}
                              className={cn(
                                'w-full flex items-start gap-2.5 rounded-md border px-3 py-2 text-left text-[13px] leading-snug transition-colors',
                                !graded &&
                                  (picked
                                    ? 'border-brand-400 bg-brand-50'
                                    : 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/40'),
                                graded &&
                                  isCorrect &&
                                  'border-emerald-300 bg-emerald-50 text-emerald-900',
                                graded &&
                                  picked &&
                                  !isCorrect &&
                                  'border-red-300 bg-red-50 text-red-900',
                                graded && !isCorrect && !picked && 'border-slate-200 text-slate-500'
                              )}
                            >
                              <span
                                className={cn(
                                  'mt-px flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] font-semibold',
                                  task.kind === 'multi' ? 'rounded-[4px]' : 'rounded-full',
                                  !graded && picked && 'border-brand-500 bg-brand-500 text-white',
                                  !graded && !picked && 'border-slate-300 text-slate-400',
                                  graded &&
                                    isCorrect &&
                                    'border-emerald-500 bg-emerald-500 text-white',
                                  graded && picked && !isCorrect && 'border-red-500 bg-red-500 text-white',
                                  graded && !isCorrect && !picked && 'border-slate-300 text-slate-400'
                                )}
                              >
                                {graded && isCorrect ? (
                                  <Check className="h-3 w-3" />
                                ) : graded && picked && !isCorrect ? (
                                  <X className="h-3 w-3" />
                                ) : (
                                  String.fromCharCode(65 + oi)
                                )}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <textarea
                        value={(answers[task.id] as string) ?? task.starter ?? ''}
                        onChange={(e) => setText(task.id, e.target.value)}
                        disabled={graded}
                        placeholder={task.placeholder}
                        rows={task.kind === 'code' ? 8 : task.kind === 'short' ? 4 : 5}
                        spellCheck={task.kind !== 'code'}
                        className={cn(
                          'w-full rounded-md border border-slate-300 px-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 resize-y focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-50 disabled:text-slate-600',
                          task.kind === 'code' && 'font-mono text-[12.5px] leading-relaxed'
                        )}
                      />
                    )}
                  </div>

                  {/* Hint */}
                  {task.hint && !graded && (
                    <div className="mt-2">
                      {hints[task.id] ? (
                        <p className="flex items-start gap-1.5 text-[12px] text-amber-700">
                          <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-px" />
                          {task.hint}
                        </p>
                      ) : (
                        <button
                          onClick={() => setHints((h) => ({ ...h, [task.id]: true }))}
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-slate-500 hover:text-slate-700"
                        >
                          <Lightbulb className="h-3.5 w-3.5" />
                          Show hint
                        </button>
                      )}
                    </div>
                  )}

                  {/* After submit: self-check tasks reveal a model answer;
                       auto-graded tasks show correct/review feedback. */}
                  {graded && selfCheck && (
                    <div className="mt-3 space-y-2.5">
                      {done ? (
                        <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700">
                          <Check className="h-3.5 w-3.5" /> Answer recorded — now compare with the
                          expert answer below.
                        </p>
                      ) : (
                        <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-amber-700">
                          <Lightbulb className="h-3.5 w-3.5" /> Try writing a fuller answer, then
                          compare with the expert answer below.
                        </p>
                      )}

                      {task.modelAnswer && (
                        <div className="rounded-lg border border-brand-200 bg-brand-50/50 px-3.5 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700 mb-1">
                            Expert answer
                          </p>
                          <p className="text-[13px] text-slate-700 leading-relaxed">
                            {task.modelAnswer}
                          </p>
                        </div>
                      )}

                      {task.selfCheck && (
                        <div className="rounded-lg border border-slate-200 px-3.5 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                            Self-check — did your answer cover this?
                          </p>
                          <ul className="space-y-1">
                            {task.selfCheck.map((c, ci) => (
                              <li
                                key={ci}
                                className="flex items-start gap-2 text-[12.5px] text-slate-600 leading-snug"
                              >
                                <Check className="h-3.5 w-3.5 text-slate-300 shrink-0 mt-px" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {task.explanation && (
                        <p className="text-[12px] text-slate-500 leading-relaxed italic">
                          {task.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {graded && !selfCheck && (
                    <div className="mt-3 flex gap-2 rounded-md bg-white/70 border border-slate-100 px-3 py-2.5">
                      <HelpCircle className="h-4 w-4 text-brand-600 shrink-0 mt-px" />
                      <p className="text-[12.5px] text-slate-700 leading-relaxed">
                        <span className="font-semibold text-slate-900">
                          {ok ? 'Correct. ' : 'Review this. '}
                        </span>
                        {task.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: submit / result */}
      <div className="max-w-3xl mt-5">
        {!graded ? (
          <button
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-brand-700 transition-colors"
          >
            Submit practice
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold',
                passed
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              )}
            >
              {passed ? <Check className="h-3.5 w-3.5" /> : null}
              {hasAuto
                ? `${passedCount}/${autoTasks.length} correct · ${scorePct}%`
                : 'Assignment complete'}
            </span>
            {hasAuto && autoTasks.length < tasks.length && (
              <span className="text-[12px] text-slate-500">
                + {tasks.length - autoTasks.length} self-checked
              </span>
            )}
            <span className="text-[12.5px] text-slate-500">
              {saving ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> saving…
                </span>
              ) : saved ? (
                'Attempt saved'
              ) : (
                'Not saved'
              )}
            </span>
            <button
              onClick={reset}
              className="ml-auto inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand-600 hover:text-brand-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PracticeHeader() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Dumbbell className="h-4 w-4" />
      </span>
      <h2 className="text-[13px] font-semibold tracking-wide uppercase text-slate-500">
        Practice Set
      </h2>
    </div>
  );
}
