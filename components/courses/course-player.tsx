'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  FileText,
  Lock,
  Dumbbell,
  CalendarClock,
  Mic,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { isPracticeTitle } from '@/lib/course-utils';
import { CourseNotes } from '@/components/courses/course-notes';
import { LessonVideo } from '@/components/courses/lesson-video';
import { LessonPractice } from '@/components/courses/lesson-practice';
import { LessonAssignment } from '@/components/courses/lesson-assignment';
import { LessonLiveQA } from '@/components/courses/lesson-live-qa';
import { LessonMockInterview } from '@/components/courses/lesson-mock-interview';
import type { Course, ModuleKind } from '@/lib/course-catalog';
import type { VideoChapter } from '@/lib/course-content/ai-testing-videos';
import type { PracticeSet } from '@/lib/course-content/ai-testing-practice';
import type { AssignmentSet } from '@/lib/course-content/ai-testing-assignments';

export interface ModuleNotes {
  title: string;
  content: string;
}

// Parse a "phase:module:lesson" deep-link param into a valid [p, m, l] tuple,
// clamped to the course structure. Returns [0, 0, 0] for anything malformed or
// out of range, so a stale/bad link never lands on an empty lesson.
function parseLessonParam(
  raw: string | null,
  course: Course,
): [number, number, number] {
  const fallback: [number, number, number] = [0, 0, 0];
  if (!raw) return fallback;
  const parts = raw.split(':').map((n) => Number(n));
  if (parts.length !== 3 || parts.some((n) => !Number.isInteger(n) || n < 0)) {
    return fallback;
  }
  const [p, m, l] = parts;
  const lesson = course.phases[p]?.modules[m]?.lessons[l];
  return lesson !== undefined ? [p, m, l] : fallback;
}

// Sidebar bullet icon per module kind.
const KIND_ICON: Record<ModuleKind, typeof Dumbbell> = {
  practice: Dumbbell,
  'live-qa': CalendarClock,
  'mock-interview': Mic,
};

// Sidebar rows show a short, uniform label ("Session 1", "Practice 2") instead of
// the full lesson title, which wraps to 2-3 lines and makes the list hard to scan.
// The full title still shows in the content header on the right.
//
// Each kind is numbered in its own sequence, so a module with 3 sessions + 3
// practice items reads 1-3 and 1-3, not 1-3 and 4-6. Live Q&A and mock-interview
// modules use their own noun — calling those "Session 1" would be misleading.
function sessionLabels(lessons: string[], kind?: ModuleKind): string[] {
  const counts = { session: 0, practice: 0, assignment: 0 };

  return lessons.map((lesson) => {
    if (/^Assignment:/i.test(lesson)) {
      counts.assignment += 1;
      return lessons.filter((l) => /^Assignment:/i.test(l)).length > 1
        ? `Assignment ${counts.assignment}`
        : 'Assignment';
    }
    if (/^Practice:/i.test(lesson)) {
      counts.practice += 1;
      // Practice sits right after its session, so number it to match that
      // session (a session without practice would otherwise shift the count).
      const sessionIdx = lessons
        .filter((l) => !/^(?:Practice|Assignment):/i.test(l))
        .indexOf(lessonTopic(lesson));
      return `Practice ${sessionIdx >= 0 ? sessionIdx + 1 : counts.practice}`;
    }

    counts.session += 1;
    if (kind === 'live-qa') return `Live Q&A ${counts.session}`;
    if (kind === 'mock-interview') return `Mock Interview ${counts.session}`;
    return `Session ${counts.session}`;
  });
}

// The topic shown under a sidebar label. Only the leading "Practice:"/"Assignment:"
// prefix is dropped — it's already conveyed by the label above it.
//
// The em-dash tail is deliberately KEPT: it's what distinguishes otherwise
// identical titles ("Capstone — Full Test Pipeline" vs "— CI/CD Integration",
// "Hallucination Detection — …" vs "… (Part 2)"). CSS truncation trims the
// overflow per row without ever collapsing two entries into the same text.
function lessonTopic(lesson: string): string {
  return lesson.replace(/^(?:Practice|Assignment|Live Q&A|Career Counseling):\s*/i, '').trim();
}

interface CoursePlayerProps {
  course: Course;
  /** Revision notes per module of the first phase, index-aligned with the module list. */
  notesByModule?: ModuleNotes[];
  /** Session-level notes keyed by "phase:module:lesson"; takes priority over notesByModule. */
  notesBySession?: Record<string, ModuleNotes>;
  /** Mux playback IDs keyed by "phase:module:lesson". Missing = placeholder. */
  videosBySession?: Record<string, string>;
  /** Video chapter lists keyed by "phase:module:lesson". Missing = no chapter UI. */
  chaptersBySession?: Record<string, VideoChapter[]>;
  /** Interactive practice sets keyed by "phase:module:lesson". */
  practiceBySession?: Record<string, PracticeSet>;
  assignmentsBySession?: Record<string, AssignmentSet>;
  /** The learner's batch (e.g. "Evening batch"); recordings are that batch's. */
  batchLabel?: string;
}

export function CoursePlayer({
  course,
  notesByModule = [],
  notesBySession = {},
  videosBySession = {},
  chaptersBySession = {},
  practiceBySession = {},
  assignmentsBySession = {},
  batchLabel,
}: CoursePlayerProps) {
  // Deep link: ?lesson=phase:module:lesson opens straight to that item (used by
  // the dashboard's Resume / Next up links). Falls back to the first lesson.
  const searchParams = useSearchParams();
  const initial = parseLessonParam(searchParams.get('lesson'), course);

  const [activePhase, setActivePhase] = useState(initial[0]);
  const [openModule, setOpenModule] = useState<number | null>(initial[1]);
  // Selected session: [phaseIndex, moduleIndex, lessonIndex]
  const [selected, setSelected] = useState<[number, number, number]>(initial);
  const contentRef = useRef<HTMLDivElement>(null);

  // Best score per practice item, keyed by lesson title, so the sidebar can
  // show which practice items the learner has already completed.
  const [practiceProgress, setPracticeProgress] = useState<
    Record<string, { score: number; passed: boolean; attempts: number }>
  >({});

  // Practice and assignment progress share one badge map, keyed by lesson
  // title. The two endpoints never return the same title, so merging is safe.
  const loadProgress = useCallback(() => {
    const slug = encodeURIComponent(course.slug);
    Promise.all([
      fetch(`/api/courses/practice/progress?courseSlug=${slug}`).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch(`/api/courses/assignment/progress?courseSlug=${slug}`).then((r) =>
        r.ok ? r.json() : null
      ),
    ])
      .then(([practice, assignment]) => {
        const merged: Record<string, { score: number; passed: boolean; attempts: number }> = {
          ...(practice?.progress ?? {}),
        };
        for (const [title, a] of Object.entries(
          (assignment?.progress ?? {}) as Record<
            string,
            { score: number; completed: boolean; attempts: number }
          >
        )) {
          merged[title] = { score: a.score, passed: a.completed, attempts: a.attempts };
        }
        setPracticeProgress(merged);
      })
      .catch(() => {
        /* non-blocking: the sidebar just shows no badges */
      });
  }, [course.slug]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const phase = course.phases[activePhase] ?? course.phases[0];
  const [selPhase, selModule, selLesson] = selected;
  const currentModule = course.phases[selPhase]?.modules[selModule];
  const currentLesson = currentModule?.lessons[selLesson];
  const sessionKey = `${selPhase}:${selModule}:${selLesson}`;

  // Session-level notes win; fall back to module-level notes (first phase only)
  const currentNotes =
    notesBySession[sessionKey] ??
    (selPhase === 0 ? notesByModule[selModule] : undefined);

  // Short label for the selected item, matching what the sidebar row shows.
  const currentLabel = currentModule
    ? sessionLabels(currentModule.lessons, currentModule.kind)[selLesson]
    : undefined;

  const currentVideoId = videosBySession[sessionKey];
  const currentPractice = practiceBySession[sessionKey];
  const currentAssignment = assignmentsBySession[sessionKey];
  const currentKind = currentModule?.kind;
  // Practice panel applies to whole practice modules and to Practice:/Assignment:
  // items living inside a content module (merged-module format).
  const isAssignmentItem = /^Assignment:/i.test(currentLesson ?? '');
  const isPracticeItem =
    !isAssignmentItem &&
    (currentKind === 'practice' || (!currentKind && isPracticeTitle(currentLesson ?? '')));
  // Progress-gated unlock isn't wired to per-user progress yet, so the mock
  // interview stays locked until Phase 1 completion tracking exists.
  const mockUnlocked = false;

  // Flat running order of the current phase, so Prev/Next can cross module
  // boundaries instead of dead-ending at the last lesson of a module.
  const phaseItems = phase.modules.flatMap((m, mi) =>
    m.lessons.map((lesson, li) => ({
      lesson,
      label: sessionLabels(m.lessons, m.kind)[li],
      moduleIndex: mi,
      lessonIndex: li,
    })),
  );
  const currentFlatIndex =
    selPhase === activePhase
      ? phaseItems.findIndex((i) => i.moduleIndex === selModule && i.lessonIndex === selLesson)
      : -1;
  const prevItem = currentFlatIndex > 0 ? phaseItems[currentFlatIndex - 1] : undefined;
  const nextItem =
    currentFlatIndex >= 0 && currentFlatIndex < phaseItems.length - 1
      ? phaseItems[currentFlatIndex + 1]
      : undefined;

  const goTo = (moduleIndex: number, lessonIndex: number) => {
    setSelected([activePhase, moduleIndex, lessonIndex]);
    setOpenModule(moduleIndex);
    // Land at the top of the new item rather than keeping the previous scroll
    // offset, which drops you mid-way into the notes.
    contentRef.current?.scrollTo({ top: 0 });
  };

  return (
    // Full-bleed workspace: breaks out of the dashboard content container and
    // fills the viewport below the 4rem topbar.
    <div className="mx-[calc(50%-50vw)] -my-4 sm:-my-6 -mb-12 sm:-mb-14 bg-white lg:h-[calc(100vh-4rem)] flex flex-col border-t border-slate-200">
      {/* Player header strip */}
      <div className="flex items-center gap-3 h-12 px-4 lg:px-5 border-b border-slate-200 shrink-0 bg-white">
        <Link
          href="/dashboard/courses"
          className="p-1 -ml-1 rounded hover:bg-slate-100 text-slate-500"
          aria-label="Back to courses"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="text-[0.875rem] font-semibold text-slate-950 truncate">
          {course.title}
        </span>
        {currentModule && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-[0.8125rem] text-slate-500 truncate hidden sm:block">
              {currentModule.title}
            </span>
          </>
        )}

        {batchLabel && (
          <span className="ml-auto shrink-0 rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-[0.6875rem] font-semibold text-brand-700">
            {batchLabel}
          </span>
        )}

        {/* Position within the phase — the full title lives in the header below,
            so repeating it here would just be noise. */}
        {currentFlatIndex >= 0 && (
          <span
            className={cn(
              'shrink-0 text-[0.75rem] font-medium text-slate-500 tabular-nums',
              !batchLabel && 'ml-auto'
            )}
          >
            {currentFlatIndex + 1} / {phaseItems.length}
          </span>
        )}
      </div>

      {/* Workspace: curriculum + content, divided by a hairline */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Left — curriculum */}
        <aside className="border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col min-h-0 max-h-[50vh] lg:max-h-none bg-slate-50/50">
          {course.phases.length > 1 && (
            <div className="flex gap-1 p-2 border-b border-slate-200 shrink-0">
              {course.phases.map((p, pi) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setActivePhase(pi);
                    // Returning to the phase you're studying reopens that module,
                    // not module 0 — otherwise the current lesson looks lost.
                    setOpenModule(pi === selPhase ? selModule : 0);
                  }}
                  className={cn(
                    'flex-1 px-2 py-2 rounded text-[0.8125rem] font-medium truncate transition-colors',
                    activePhase === pi
                      ? 'bg-slate-950 text-white'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  )}
                >
                  {p.name.replace(' — ', ' · ')}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto min-h-0">
            {phase.modules.map((module, mi) => {
              const isOpen = openModule === mi;
              const hasSessions = module.lessons.length > 0;
              const moduleActive = selPhase === activePhase && selModule === mi;
              const labels = sessionLabels(module.lessons, module.kind);
              return (
                <div key={module.title} className="border-b border-slate-200/70">
                  <button
                    onClick={() => setOpenModule(isOpen ? null : mi)}
                    className={cn(
                      'w-full flex items-start gap-2 px-3.5 py-2.5 text-left hover:bg-slate-100/70',
                      moduleActive && !isOpen && 'bg-slate-100/70'
                    )}
                    aria-expanded={isOpen}
                  >
                    <span className="font-mono text-[0.75rem] text-slate-400 mt-[3px] shrink-0 w-5">
                      {String(mi + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[0.875rem] font-semibold text-slate-900 leading-snug">
                        {module.title}
                      </span>
                      <span className="block text-[0.75rem] text-slate-500 mt-0.5">
                        {module.detail}
                      </span>
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 text-slate-400 shrink-0 mt-1 transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="pb-1.5 bg-white">
                      {hasSessions ? (
                        module.lessons.map((lesson, li) => {
                          const isActive =
                            selPhase === activePhase && selModule === mi && selLesson === li;
                          const isLockedItem =
                            module.kind === 'mock-interview' &&
                            module.lockedUntilPhaseComplete &&
                            !mockUnlocked;
                          const ItemIcon = isLockedItem
                            ? Lock
                            : module.kind
                              ? KIND_ICON[module.kind]
                              : isPracticeTitle(lesson)
                                ? KIND_ICON.practice
                                : PlayCircle;
                          return (
                            <button
                              key={lesson}
                              onClick={() => goTo(mi, li)}
                              title={lesson}
                              aria-current={isActive ? 'true' : undefined}
                              className={cn(
                                'w-full flex items-start gap-2.5 pl-[34px] pr-3 py-2 text-left border-l-2 transition-colors',
                                isActive
                                  ? 'border-brand-600 bg-brand-50/70'
                                  : 'border-transparent hover:bg-slate-100/70'
                              )}
                            >
                              <ItemIcon
                                className={cn(
                                  'h-4 w-4 shrink-0 mt-px',
                                  isActive ? 'text-brand-600' : 'text-slate-400'
                                )}
                              />
                              <span className="flex-1 min-w-0">
                                <span
                                  className={cn(
                                    'block text-[0.8125rem] leading-snug',
                                    isActive
                                      ? 'font-semibold text-brand-700'
                                      : 'font-medium text-slate-800'
                                  )}
                                >
                                  {labels[li]}
                                </span>
                                {/* Topic line: keeps the list scannable without
                                    letting long titles wrap to three lines. */}
                                <span
                                  className={cn(
                                    'block text-[0.75rem] leading-snug truncate mt-px',
                                    isActive ? 'text-slate-700' : 'text-slate-500'
                                  )}
                                >
                                  {lessonTopic(lesson)}
                                </span>
                              </span>
                              {/* Practice items the learner has attempted show
                                  their best score, so progress is visible
                                  without opening each one. */}
                              {practiceProgress[lesson] && (
                                <span
                                  className={cn(
                                    'shrink-0 mt-px inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[0.6875rem] font-semibold',
                                    practiceProgress[lesson].passed
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  )}
                                >
                                  {practiceProgress[lesson].passed && (
                                    <Check className="h-3 w-3" />
                                  )}
                                  {practiceProgress[lesson].score}%
                                </span>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <p className="flex items-center gap-1.5 pl-[38px] pr-3 py-1.5 text-[0.7188rem] text-slate-400">
                          <Lock className="h-3 w-3" />
                          Sessions unlock with this phase
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center — content area (kind-aware), one scroll area */}
        <div
          ref={contentRef}
          className="min-h-0 overflow-y-auto border-b lg:border-b-0 border-slate-200"
        >
          {isAssignmentItem ? (
            <>
              <ItemHeader
                label={currentLabel}
                title={currentLesson?.replace(/^Assignment:\s*/, '') ?? ''}
                subtitle={`${currentModule?.title} · ${course.phases[selPhase]?.name}`}
              />
              <LessonAssignment
                key={sessionKey}
                title={currentLesson ?? ''}
                courseSlug={course.slug}
                set={currentAssignment}
                onSaved={loadProgress}
              />
            </>
          ) : isPracticeItem ? (
            <>
              <ItemHeader
                label={currentLabel}
                title={currentLesson?.replace(/^(?:Practice|Assignment):\s*/, '') ?? ''}
                subtitle={`${currentModule?.title} · ${course.phases[selPhase]?.name}`}
              />
              <LessonPractice
                key={sessionKey}
                title={currentLesson ?? ''}
                courseSlug={course.slug}
                set={currentPractice}
                onSaved={loadProgress}
              />
            </>
          ) : currentKind === 'live-qa' ? (
            <>
              <ItemHeader
                label={currentLabel}
                title={currentLesson ?? ''}
                subtitle={`${currentModule?.title} · ${course.phases[selPhase]?.name}`}
              />
              <LessonLiveQA key={sessionKey} title={currentLesson ?? ''} />
            </>
          ) : currentKind === 'mock-interview' ? (
            <>
              <ItemHeader
                label={currentLabel}
                title={currentLesson ?? ''}
                subtitle={`${currentModule?.title} · ${course.phases[selPhase]?.name}`}
              />
              <LessonMockInterview
                key={sessionKey}
                title={currentLesson ?? ''}
                unlocked={mockUnlocked}
                phaseName={course.phases[selPhase]?.name ?? 'this phase'}
              />
            </>
          ) : (
            <>
              {/* Video */}
              <div className="bg-slate-950">
                <LessonVideo
                  key={sessionKey}
                  playbackId={currentVideoId}
                  title={currentLesson ?? 'select a session'}
                  chapters={chaptersBySession[sessionKey]}
                />
              </div>

              {/* Session title */}
              {currentLesson && (
                <ItemHeader
                  label={currentLabel}
                  title={currentLesson}
                  subtitle={`${currentModule?.title} · ${course.phases[selPhase]?.name}`}
                />
              )}

              {/* Revision notes */}
              <div className="px-6 lg:px-8">
                <div className="flex items-center gap-1.5 px-3 py-3 text-[0.8125rem] font-semibold text-slate-950 border-b border-slate-200">
                  <FileText className="h-4 w-4" />
                  Revision Notes
                </div>
              </div>

              <div className="px-6 lg:px-8 py-5">
                {currentNotes ? (
                  // Strip the leading H1 — the session title is already shown above.
                  <CourseNotes content={currentNotes.content.replace(/^#\s+.+$\n?/m, '')} />
                ) : (
                  <p className="text-[0.8438rem] text-slate-500 leading-relaxed max-w-2xl">
                    Revision notes for this session will appear here — key concepts, commands
                    and code snippets from the lecture, ready to skim before interviews.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Prev / Next — keeps the learner moving without going back to the
              sidebar after every item. */}
          {(prevItem || nextItem) && (
            <div className="flex items-stretch gap-3 px-6 lg:px-8 py-6 mt-2 border-t border-slate-200">
              {prevItem ? (
                <button
                  onClick={() => goTo(prevItem.moduleIndex, prevItem.lessonIndex)}
                  className="group flex-1 min-w-0 flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-400 shrink-0 group-hover:text-slate-600" />
                  <span className="min-w-0">
                    <span className="block text-[0.6875rem] font-semibold uppercase tracking-wider text-slate-400">
                      Previous
                    </span>
                    <span className="block text-[0.8125rem] font-medium text-slate-800 truncate">
                      {prevItem.label} · {lessonTopic(prevItem.lesson)}
                    </span>
                  </span>
                </button>
              ) : (
                <span className="flex-1" />
              )}

              {nextItem ? (
                <button
                  onClick={() => goTo(nextItem.moduleIndex, nextItem.lessonIndex)}
                  className="group flex-1 min-w-0 flex items-center justify-end gap-3 rounded-lg border border-slate-200 px-4 py-3 text-right hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <span className="min-w-0">
                    <span className="block text-[0.6875rem] font-semibold uppercase tracking-wider text-slate-400">
                      Next
                    </span>
                    <span className="block text-[0.8125rem] font-medium text-slate-800 truncate">
                      {nextItem.label} · {lessonTopic(nextItem.lesson)}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 group-hover:text-slate-600" />
                </button>
              ) : (
                <span className="flex-1" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Shared title strip shown above every content area (video sessions, practice,
// live Q&A, mock interview) so they read consistently.
function ItemHeader({
  title,
  subtitle,
  label,
}: {
  title: string;
  subtitle: string;
  /** Short sidebar label ("Session 2") shown as an eyebrow above the full title. */
  label?: string;
}) {
  return (
    <div className="px-6 lg:px-8 py-5 border-b border-slate-200">
      {label && (
        <p className="text-[0.75rem] font-semibold uppercase tracking-wider text-brand-600 mb-1.5">
          {label}
        </p>
      )}
      <h1 className="text-[1.375rem] font-bold text-slate-950 leading-tight">{title}</h1>
      <p className="text-[0.8125rem] text-slate-500 mt-1.5">{subtitle}</p>
    </div>
  );
}
