'use client';

import { useEffect, useState } from 'react';
import {
  ClipboardList,
  Check,
  Loader2,
  RotateCcw,
  ExternalLink,
  Lightbulb,
  ChevronRight,
  Copy,
  Terminal,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCSRFHeaders } from '@/lib/utils/csrf-client';
import { InlineMd } from '@/components/courses/inline-md';
import type { AssignmentSet, AssignmentTask } from '@/lib/course-content/ai-testing-assignments';

interface LessonAssignmentProps {
  title: string;
  courseSlug: string;
  set?: AssignmentSet;
  /** Called after progress saves, so the sidebar can refresh. */
  onSaved?: () => void;
}

// What we store per task: 'do'/'setup' record a tick, 'choose' records the
// picked option indices. No free text anywhere — the work happens in the tools.
type TaskState = { done: true } | { picked: number[] };

function isDone(task: AssignmentTask, st: TaskState | undefined): boolean {
  if (!st) return false;
  if ('done' in st) return st.done;
  if (task.kind !== 'choose') return false;
  const correct = (task.choices ?? [])
    .map((c, i) => (c.correct ? i : -1))
    .filter((i) => i >= 0);
  const picked = st.picked ?? [];
  return (
    picked.length === correct.length && correct.every((i) => picked.includes(i))
  );
}

const KIND_LABEL: Record<AssignmentTask['kind'], string> = {
  do: 'Do it',
  choose: 'Decide',
  setup: 'Setup',
};

const KIND_STYLE: Record<AssignmentTask['kind'], string> = {
  do: 'bg-brand-50 text-brand-700 border-brand-200',
  choose: 'bg-violet-50 text-violet-700 border-violet-200',
  setup: 'bg-slate-100 text-slate-600 border-slate-200',
};

function CopyRow({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-900 px-3 py-2">
      <Terminal className="h-3.5 w-3.5 shrink-0 text-slate-500" />
      <code className="flex-1 min-w-0 truncate font-mono text-[0.75rem] text-slate-100">{cmd}</code>
      <button
        onClick={() => {
          navigator.clipboard.writeText(cmd);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="shrink-0 text-slate-400 hover:text-white transition-colors"
        aria-label="Copy command"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

export function LessonAssignment({ title, courseSlug, set, onSaved }: LessonAssignmentProps) {
  const [state, setState] = useState<Record<string, TaskState>>({});
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore previous progress so ticks and answers survive a reload.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(
      `/api/courses/assignment/latest?courseSlug=${encodeURIComponent(
        courseSlug
      )}&itemTitle=${encodeURIComponent(title)}`
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.attempt?.answers) return;
        setState(data.attempt.answers as Record<string, TaskState>);
      })
      .catch(() => {
        /* non-blocking */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseSlug, title]);

  if (!set) {
    return (
      <div className="px-6 lg:px-8 py-6">
        <AssignmentHeader />
        <div className="max-w-2xl rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-8 text-center">
          <p className="text-[0.875rem] font-semibold text-slate-800">
            Assignment for this session is on the way
          </p>
          <p className="mt-1.5 text-[0.8125rem] text-slate-500 leading-relaxed">
            The homework for{' '}
            <span className="font-medium text-slate-700">
              {title.replace(/^Assignment:\s*/, '')}
            </span>{' '}
            will unlock here shortly.
          </p>
        </div>
      </div>
    );
  }

  const tasks = set.tasks;
  const doneCount = tasks.filter((t) => isDone(t, state[t.id])).length;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  // Saving is automatic: every tick or answer persists, so nothing is lost and
  // there is no "submit" ceremony for what is really a checklist.
  const persist = async (next: Record<string, TaskState>) => {
    const dc = tasks.filter((t) => isDone(t, next[t.id])).length;
    const p = tasks.length ? Math.round((dc / tasks.length) * 100) : 0;
    setSaving(true);
    try {
      const res = await fetch('/api/courses/assignment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getCSRFHeaders() },
        body: JSON.stringify({
          courseSlug,
          itemTitle: title,
          answers: next,
          score: p,
          completed: dc === tasks.length,
          totalTasks: tasks.length,
          doneTasks: dc,
        }),
      });
      if (res.ok) {
        setSaveError(null);
        onSaved?.();
      } else {
        const body = await res.json().catch(() => null);
        setSaveError(
          res.status === 401
            ? 'Not saved: please sign in again'
            : `Not saved: ${body?.error ?? `error ${res.status}`}`
        );
      }
    } catch {
      setSaveError('Not saved: you appear to be offline');
    } finally {
      setSaving(false);
    }
  };

  const toggleDone = (taskId: string) => {
    const cur = state[taskId];
    const isOn = cur && 'done' in cur && cur.done;
    const next = { ...state };
    if (isOn) delete next[taskId];
    else next[taskId] = { done: true };
    setState(next);
    void persist(next);
  };

  const pick = (task: AssignmentTask, index: number) => {
    const multi = (task.choices ?? []).filter((c) => c.correct).length > 1;
    const cur = state[task.id];
    const picked = cur && 'picked' in cur ? cur.picked : [];
    const nextPicked = multi
      ? picked.includes(index)
        ? picked.filter((i) => i !== index)
        : [...picked, index]
      : [index];
    const next = { ...state, [task.id]: { picked: nextPicked } };
    setState(next);
    void persist(next);
    // Choosing reveals the reasoning — that is the teaching moment.
    setReveal((r) => ({ ...r, [task.id]: true }));
  };

  const reset = () => {
    setState({});
    setReveal({});
    void persist({});
  };

  return (
    <div className="px-6 lg:px-8 py-6">
      <AssignmentHeader session={set.session} />
      <p className="max-w-none text-[0.9375rem] leading-relaxed text-slate-600 mb-5">
        <InlineMd>{set.intro}</InlineMd>
      </p>

      {/* Progress */}
      <div className="max-w-none mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[0.75rem] font-medium text-slate-600">
            {doneCount} of {tasks.length} done
          </span>
          <span className="text-[0.75rem] font-semibold text-slate-700">
            {saving ? 'saving...' : saveError ? (
              <span className="text-amber-700">{saveError}</span>
            ) : (
              `${pct}%`
            )}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              pct === 100 ? 'bg-emerald-500' : 'bg-brand-600'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="max-w-none space-y-4">
        {tasks.map((task, ti) => {
          const done = isDone(task, state[task.id]);
          const st = state[task.id];
          const picked = st && 'picked' in st ? st.picked : [];
          const answered = picked.length > 0;
          const showAnswer = reveal[task.id];

          return (
            <div
              key={task.id}
              className={cn(
                'rounded-xl border p-4 transition-colors',
                done ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'
              )}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={cn(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-semibold',
                    done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : ti + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[0.9375rem] font-semibold text-slate-900">{task.title}</h3>
                    <span
                      className={cn(
                        'rounded-full border px-1.5 py-0.5 text-[0.6875rem] font-semibold',
                        KIND_STYLE[task.kind]
                      )}
                    >
                      {KIND_LABEL[task.kind]}
                    </span>
                  </div>

                  <p className="mt-1.5 text-[0.875rem] text-slate-700 leading-relaxed whitespace-pre-line">
                    <InlineMd>{task.prompt}</InlineMd>
                  </p>

                  {/* Steps + tool button */}
                  {task.steps && (
                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-3">
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                        {!task.toolLink
                          ? 'Steps'
                          : task.toolLink.href.startsWith('/')
                            ? 'Do this on QodeBench'
                            : 'Steps'}
                      </p>
                      <ol className="list-decimal pl-4 space-y-1 marker:text-slate-400">
                        {task.steps.map((step, si) => (
                          <li key={si} className="text-[0.7812rem] text-slate-600 leading-snug">
                            <InlineMd>{step}</InlineMd>
                          </li>
                        ))}
                      </ol>
                      {task.toolLink && (
                        <a
                          href={task.toolLink.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-1.5 text-[0.75rem] font-semibold text-white hover:bg-brand-700 transition-colors"
                        >
                          {task.toolLink.label}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* External sites this task sends you to */}
                  {task.links && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {task.links.map((l, li) => (
                        <a
                          key={li}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700 transition-colors"
                        >
                          {l.label}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Commands with copy buttons */}
                  {task.commands && (
                    <div className="mt-3 space-y-1.5">
                      {task.commands.map((c, ci) => (
                        <CopyRow key={ci} cmd={c} />
                      ))}
                    </div>
                  )}

                  {/* Choose: click an option, get the reasoning */}
                  {task.kind === 'choose' && task.choices && (
                    <div className="mt-3 space-y-1.5">
                      {task.choices.map((c, ci) => {
                        const isPicked = picked.includes(ci);
                        const showResult = answered;
                        return (
                          <button
                            key={ci}
                            onClick={() => pick(task, ci)}
                            className={cn(
                              'w-full flex items-start gap-2 rounded-lg border px-3 py-2 text-left text-[0.8125rem] transition-colors',
                              !showResult && 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/40',
                              showResult && isPicked && c.correct && 'border-emerald-300 bg-emerald-50',
                              showResult && isPicked && !c.correct && 'border-red-300 bg-red-50',
                              showResult && !isPicked && c.correct && 'border-emerald-200 bg-emerald-50/40',
                              showResult && !isPicked && !c.correct && 'border-slate-200 opacity-60'
                            )}
                          >
                            {showResult && c.correct ? (
                              <Check className="h-4 w-4 shrink-0 mt-px text-emerald-600" />
                            ) : (
                              <Circle
                                className={cn(
                                  'h-4 w-4 shrink-0 mt-px',
                                  isPicked ? 'text-red-500 fill-red-500' : 'text-slate-300'
                                )}
                              />
                            )}
                            <span className="text-slate-800">{c.text}</span>
                          </button>
                        );
                      })}
                      {answered && task.why && (
                        <div className="mt-2 rounded-lg border border-brand-200 bg-brand-50/40 px-3.5 py-3">
                          <ExpertAnswer text={task.why} />
                        </div>
                      )}
                    </div>
                  )}

                  {task.hint && !done && (
                    <p className="mt-2.5 flex items-start gap-1.5 text-[0.75rem] text-amber-700">
                      <Lightbulb className="h-3.5 w-3.5 mt-px shrink-0" />
                      <span>{task.hint}</span>
                    </p>
                  )}

                  {/* Do / Setup: one tick, no typing */}
                  {task.kind !== 'choose' && (
                    <button
                      onClick={() => toggleDone(task.id)}
                      className={cn(
                        'mt-3 flex w-fit items-center gap-2 rounded-lg border px-3.5 py-2 text-[0.8125rem] font-medium transition-colors',
                        done
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : 'border-slate-300 text-slate-700 hover:border-brand-400 hover:bg-brand-50/40'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded border',
                          done ? 'border-emerald-600 bg-emerald-600' : 'border-slate-400'
                        )}
                      >
                        {done && <Check className="h-3 w-3 text-white" />}
                      </span>
                      {done ? 'Done' : 'Mark as done'}
                    </button>
                  )}

                  {/* Expert answer: always available, never required */}
                  {task.modelAnswer && (
                    <div className="mt-3">
                      <button
                        onClick={() => setReveal((r) => ({ ...r, [task.id]: !r[task.id] }))}
                        className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-brand-600 hover:text-brand-700"
                      >
                        <ChevronRight
                          className={cn('h-3.5 w-3.5 transition-transform', showAnswer && 'rotate-90')}
                        />
                        {showAnswer ? 'Hide' : 'Check yourself against'} the expert answer
                      </button>
                      {showAnswer && (
                        <div className="mt-2 rounded-lg border border-brand-200 bg-brand-50/40 px-3.5 py-3">
                          <ExpertAnswer text={task.modelAnswer} />
                          {task.selfCheck && (
                            <ul className="mt-2.5 space-y-1">
                              {task.selfCheck.map((c, ci) => (
                                <li
                                  key={ci}
                                  className="flex items-start gap-1.5 text-[0.75rem] text-slate-600"
                                >
                                  <Check className="h-3.5 w-3.5 mt-px shrink-0 text-brand-600" />
                                  {c}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {set.nextSession && (
        <p className="max-w-none mt-5 rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-3 text-[0.8125rem] text-slate-600">
          <span className="font-semibold text-slate-800">Next session:</span> {set.nextSession}
        </p>
      )}

      {loading ? (
        <p className="max-w-none mt-4 inline-flex items-center gap-2 text-[0.8125rem] text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your progress...
        </p>
      ) : (
        doneCount > 0 && (
          <button
            onClick={reset}
            className="mt-4 inline-flex items-center gap-1.5 text-[0.7812rem] font-medium text-brand-600 hover:text-brand-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Start over
          </button>
        )
      )}
    </div>
  );
}

// Expert answers are written as short blocks with blank lines between them,
// plus the odd numbered or bulleted list. InlineMd only handles inline marks,
// so split the block structure here and let it style the text inside each line.
function ExpertAnswer({ text }: { text: string }) {
  const blocks = text.split('\n\n').filter((b) => b.trim());
  return (
    <div className="space-y-2.5 text-[0.8125rem] text-slate-700 leading-relaxed">
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.trim());
        const isList = lines.every((l) => /^\s*(?:[-*]|\d+\.)\s+/.test(l));

        if (isList) {
          const ordered = /^\s*\d+\.\s+/.test(lines[0]);
          const items = lines.map((l) => l.replace(/^\s*(?:[-*]|\d+\.)\s+/, ''));
          const cls = 'pl-5 space-y-1 marker:text-slate-400';
          return ordered ? (
            <ol key={bi} className={cn('list-decimal', cls)}>
              {items.map((it, ii) => (
                <li key={ii}>
                  <InlineMd>{it}</InlineMd>
                </li>
              ))}
            </ol>
          ) : (
            <ul key={bi} className={cn('list-disc', cls)}>
              {items.map((it, ii) => (
                <li key={ii}>
                  <InlineMd>{it}</InlineMd>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={bi}>
            <InlineMd>{block}</InlineMd>
          </p>
        );
      })}
    </div>
  );
}

function AssignmentHeader({ session }: { session?: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <ClipboardList className="h-4 w-4 text-brand-600" />
      <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-brand-600">
        Assignment{session ? ` · after session ${session}` : ''}
      </span>
    </div>
  );
}
