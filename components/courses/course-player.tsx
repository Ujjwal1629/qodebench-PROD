'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronDown,
  PlayCircle,
  FileText,
  ListChecks,
  Lock,
  Dumbbell,
  CalendarClock,
  Mic,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CourseNotes } from '@/components/courses/course-notes';
import { LessonVideo } from '@/components/courses/lesson-video';
import { LessonQuiz } from '@/components/courses/lesson-quiz';
import { LessonPractice } from '@/components/courses/lesson-practice';
import { LessonLiveQA } from '@/components/courses/lesson-live-qa';
import { LessonMockInterview } from '@/components/courses/lesson-mock-interview';
import type { Course, ModuleKind } from '@/lib/course-catalog';
import type { MCQ } from '@/lib/course-content/ai-testing-mcqs';
import type { VideoChapter } from '@/lib/course-content/ai-testing-videos';
import type { PracticeSet } from '@/lib/course-content/ai-testing-practice';

export interface ModuleNotes {
  title: string;
  content: string;
}

type LessonTab = 'notes' | 'mcq';

// Merged content modules list their practice items alongside the session
// recording; the title prefix marks an item as practice (works even before
// its practice set is authored).
const isPracticeTitle = (title: string) => /^(Practice|Assignment):/.test(title);

// Sidebar bullet icon per module kind.
const KIND_ICON: Record<ModuleKind, typeof Dumbbell> = {
  practice: Dumbbell,
  'live-qa': CalendarClock,
  'mock-interview': Mic,
};

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
  /** MCQ quizzes keyed by "phase:module:lesson". Missing = empty quiz. */
  mcqsBySession?: Record<string, MCQ[]>;
  /** Interactive practice sets keyed by "phase:module:lesson". */
  practiceBySession?: Record<string, PracticeSet>;
}

export function CoursePlayer({
  course,
  notesByModule = [],
  notesBySession = {},
  videosBySession = {},
  chaptersBySession = {},
  mcqsBySession = {},
  practiceBySession = {},
}: CoursePlayerProps) {
  const [activePhase, setActivePhase] = useState(0);
  const [openModule, setOpenModule] = useState<number | null>(0);
  // Selected session: [phaseIndex, moduleIndex, lessonIndex]
  const [selected, setSelected] = useState<[number, number, number]>([0, 0, 0]);
  // Below-video tab; Revision Notes is the default.
  const [tab, setTab] = useState<LessonTab>('notes');

  const phase = course.phases[activePhase] ?? course.phases[0];
  const [selPhase, selModule, selLesson] = selected;
  const currentModule = course.phases[selPhase]?.modules[selModule];
  const currentLesson = currentModule?.lessons[selLesson];
  const sessionKey = `${selPhase}:${selModule}:${selLesson}`;

  // Session-level notes win; fall back to module-level notes (first phase only)
  const currentNotes =
    notesBySession[sessionKey] ??
    (selPhase === 0 ? notesByModule[selModule] : undefined);

  const currentVideoId = videosBySession[sessionKey];
  const currentMcqs = mcqsBySession[sessionKey] ?? [];
  const currentPractice = practiceBySession[sessionKey];
  const currentKind = currentModule?.kind;
  // Practice panel applies to whole practice modules and to Practice:/Assignment:
  // items living inside a content module (merged-module format).
  const isPracticeItem =
    currentKind === 'practice' || (!currentKind && isPracticeTitle(currentLesson ?? ''));
  // Progress-gated unlock isn't wired to per-user progress yet, so the mock
  // interview stays locked until Phase 1 completion tracking exists.
  const mockUnlocked = false;

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
        <span className="text-[14px] font-semibold text-slate-950 truncate">
          {course.title}
        </span>
        {currentLesson && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-[13px] text-slate-500 truncate hidden sm:block">
              {currentLesson}
            </span>
          </>
        )}
      </div>

      {/* Workspace: curriculum + content, divided by a hairline */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Left — curriculum */}
        <aside className="border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col min-h-0 max-h-[50vh] lg:max-h-none bg-slate-50/50">
          {course.phases.length > 1 && (
            <div className="flex gap-1 p-2 border-b border-slate-200 shrink-0">
              {course.phases.map((p, pi) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setActivePhase(pi);
                    setOpenModule(0);
                  }}
                  className={cn(
                    'flex-1 px-2 py-1.5 rounded text-[12px] font-medium truncate transition-colors',
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
                    <span className="font-mono text-[10.5px] text-slate-400 mt-[3px] shrink-0 w-4">
                      {String(mi + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[12.5px] font-semibold text-slate-900 leading-snug">
                        {module.title}
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-px">
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
                              onClick={() => {
                                setSelected([activePhase, mi, li]);
                                setTab('notes');
                              }}
                              className={cn(
                                'w-full flex items-start gap-2 pl-[38px] pr-3 py-[7px] text-left border-l-2',
                                isActive
                                  ? 'border-brand-600 bg-brand-50/70'
                                  : 'border-transparent hover:bg-slate-50'
                              )}
                            >
                              <ItemIcon
                                className={cn(
                                  'h-3.5 w-3.5 mt-[2px] shrink-0',
                                  isActive ? 'text-brand-600' : 'text-slate-300'
                                )}
                              />
                              <span
                                className={cn(
                                  'text-[12px] leading-snug',
                                  isActive ? 'font-semibold text-slate-950' : 'text-slate-600'
                                )}
                              >
                                {lesson}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <p className="flex items-center gap-1.5 pl-[38px] pr-3 py-1.5 text-[11.5px] text-slate-400">
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
        <div className="min-h-0 overflow-y-auto border-b lg:border-b-0 border-slate-200">
          {isPracticeItem ? (
            <>
              <ItemHeader
                title={currentLesson?.replace(/^Practice:\s*/, '') ?? ''}
                subtitle={`${currentModule?.title} · ${course.phases[selPhase]?.name}`}
              />
              <LessonPractice
                key={sessionKey}
                title={currentLesson ?? ''}
                courseSlug={course.slug}
                set={currentPractice}
              />
            </>
          ) : currentKind === 'live-qa' ? (
            <>
              <ItemHeader
                title={currentLesson ?? ''}
                subtitle={`${currentModule?.title} · ${course.phases[selPhase]?.name}`}
              />
              <LessonLiveQA key={sessionKey} title={currentLesson ?? ''} />
            </>
          ) : currentKind === 'mock-interview' ? (
            <>
              <ItemHeader
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
                  title={currentLesson}
                  subtitle={`${currentModule?.title} · ${course.phases[selPhase]?.name}`}
                />
              )}

              {/* Tabs: Revision Notes (default) + On-site MCQ */}
              <div className="px-6 lg:px-8">
                <div className="flex items-center gap-1 border-b border-slate-200">
                  <button
                    onClick={() => setTab('notes')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-3 text-[13px] font-semibold border-b-2 -mb-px transition-colors',
                      tab === 'notes'
                        ? 'border-brand-600 text-slate-950'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    )}
                  >
                    <FileText className="h-4 w-4" />
                    Revision Notes
                  </button>
                  <button
                    onClick={() => setTab('mcq')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-3 text-[13px] font-semibold border-b-2 -mb-px transition-colors',
                      tab === 'mcq'
                        ? 'border-brand-600 text-slate-950'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    )}
                  >
                    <ListChecks className="h-4 w-4" />
                    MCQ
                    {currentMcqs.length > 0 && (
                      <span className="ml-0.5 text-[11px] font-mono text-slate-400">
                        {currentMcqs.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="px-6 lg:px-8 py-5">
                {tab === 'notes' ? (
                  currentNotes ? (
                    // Strip the leading H1 — the session title is already shown above the tabs.
                    <CourseNotes content={currentNotes.content.replace(/^#\s+.+$\n?/m, '')} />
                  ) : (
                    <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-2xl">
                      Revision notes for this session will appear here — key concepts, commands
                      and code snippets from the lecture, ready to skim before interviews.
                    </p>
                  )
                ) : (
                  <LessonQuiz key={sessionKey} questions={currentMcqs} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Shared title strip shown above every content area (video sessions, practice,
// live Q&A, mock interview) so they read consistently.
function ItemHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="px-6 lg:px-8 py-4 border-b border-slate-200">
      <h1 className="text-[16px] font-bold text-slate-950 leading-snug">{title}</h1>
      <p className="text-[12px] text-slate-500 mt-0.5">{subtitle}</p>
    </div>
  );
}
