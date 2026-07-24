'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChevronDown, ChevronRight, ArrowRight, ArrowLeft, Search,
  GraduationCap, BookOpen, Code2, Lock, Crown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  INTERVIEW_SECTIONS,
  TOTAL_QUESTIONS,
  PLAYWRIGHT_FRAMEWORK_SECTIONS,
  TOTAL_PLAYWRIGHT_FRAMEWORK_QUESTIONS,
  type InterviewSection,
  type InterviewQuestion,
} from '@/lib/constants/interview-questions';

const FREE_SECTIONS_PER_BANK = 4;

type View = 'home' | 'bank' | 'section';
type QuestionBank = 'js-ts' | 'playwright';

// ─── Code block renderer ─────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-x-auto font-mono leading-relaxed">
      {code}
    </pre>
  );
}

// ─── Question card (expandable) ──────────────────────────────────────────────

function QuestionCard({ q, index }: { q: InterviewQuestion; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Card
      className={cn(
        'border transition-all cursor-pointer',
        open
          ? 'border-brand-300 bg-brand-50/30 shadow-sm'
          : 'border-slate-200 hover:border-brand-200 hover:bg-slate-50'
      )}
    >
      <div onClick={() => setOpen(!open)} className="p-4 flex items-start gap-3">
        <div className={cn(
          'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
          open ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'
        )}>
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium text-sm leading-snug',
            open ? 'text-brand-900' : 'text-slate-800'
          )}>
            {q.question}
          </p>
        </div>
        {open ? (
          <ChevronDown className="h-4 w-4 text-brand-600 flex-shrink-0 mt-0.5" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
        )}
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-brand-200 pt-3 ml-10">
          <div>
            <Badge variant="outline" className="text-xs mb-2 text-brand-700 border-brand-300">
              Answer
            </Badge>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {q.answer}
            </p>
          </div>
          {q.example && (
            <div>
              <Badge variant="outline" className="text-xs mb-2 text-brand-700 border-brand-300">
                Example
              </Badge>
              <CodeBlock code={q.example} />
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── Section detail view ─────────────────────────────────────────────────────

function SectionView({
  section,
  bankLabel,
  onBack,
}: {
  section: InterviewSection;
  bankLabel: string;
  onBack: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = searchQuery
    ? section.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : section.questions;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={onBack} className="hover:text-brand-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          {bankLabel}
        </button>
        <span>/</span>
        <span>{section.title}</span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <span className="text-3xl">{section.icon}</span>
            {section.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {section.questions.length} questions in this section
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search questions in this section..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        />
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {filtered.map((q, i) => (
          <QuestionCard key={q.id} q={q} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No questions match your search.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Bank sections list view ─────────────────────────────────────────────────

function BankView({
  bank,
  onBack,
  onOpenSection,
  isPaidUser,
}: {
  bank: QuestionBank;
  onBack: () => void;
  onOpenSection: (section: InterviewSection, index: number) => void;
  isPaidUser: boolean;
}) {
  const sections = bank === 'js-ts' ? INTERVIEW_SECTIONS : PLAYWRIGHT_FRAMEWORK_SECTIONS;
  const totalQuestions = bank === 'js-ts' ? TOTAL_QUESTIONS : TOTAL_PLAYWRIGHT_FRAMEWORK_QUESTIONS;
  const title = bank === 'js-ts' ? 'JavaScript & TypeScript' : 'Playwright Framework';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = searchQuery
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.questions.some(
            (q) =>
              q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.answer.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : sections;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={onBack} className="hover:text-brand-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Interview Prep
        </button>
        <span>/</span>
        <span>{title}</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
          {bank === 'js-ts' ? <Code2 className="h-8 w-8 text-brand-600" /> : <span className="text-3xl">🎭</span>}
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {sections.length} sections &middot; {totalQuestions} questions with answers &amp; code examples
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search sections or questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
        />
      </div>

      {/* Section Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSections.map((section, index) => {
          const originalIndex = sections.indexOf(section);
          const isLocked = originalIndex >= FREE_SECTIONS_PER_BANK && !isPaidUser;

          return (
            <Card
              key={section.id}
              className={cn(
                'relative overflow-hidden h-full border cursor-pointer transition-all hover:shadow-sm',
                isLocked
                  ? 'border-slate-200 bg-slate-50 opacity-70 hover:border-slate-300'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              )}
              onClick={() => onOpenSection(section, originalIndex)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{isLocked ? '🔒' : section.icon}</span>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-xs">
                      {section.questions.length} Q&apos;s
                    </Badge>
                    {isLocked && (
                      <Badge className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1">
                        <Crown className="h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="mt-2 text-base leading-snug">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  {isLocked ? (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Lock className="h-4 w-4" />
                      Locked
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
                      <BookOpen className="h-4 w-4" />
                      View Questions
                    </div>
                  )}
                  <ArrowRight className={cn('h-4 w-4', isLocked ? 'text-slate-400' : 'text-brand-600')} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSections.length === 0 && (
        <div className="text-center py-10 text-slate-500">
          No sections match your search.
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function InterviewPrepPage() {
  const router = useRouter();
  const [view, setView] = useState<View>('home');
  const [activeBank, setActiveBank] = useState<QuestionBank>('js-ts');
  const [activeSection, setActiveSection] = useState<InterviewSection | null>(null);
  const [isPaidUser, setIsPaidUser] = useState(false);

  // Fetch subscription status on mount
  useEffect(() => {
    fetch('/api/payments/subscription-status')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.subscription?.isActive) {
          setIsPaidUser(true);
        }
      })
      .catch(() => { /* stay as free user on error */ });
  }, []);

  const allTotalQuestions = TOTAL_QUESTIONS + TOTAL_PLAYWRIGHT_FRAMEWORK_QUESTIONS;

  const openBank = (bank: QuestionBank) => {
    setActiveBank(bank);
    setView('bank');
  };

  const openSection = (section: InterviewSection, index: number) => {
    if (index >= FREE_SECTIONS_PER_BANK && !isPaidUser) {
      router.push('/pricing');
      return;
    }
    setActiveSection(section);
    setView('section');
  };

  const goHome = () => {
    setView('home');
    setActiveSection(null);
  };

  const goToBank = () => {
    setView('bank');
    setActiveSection(null);
  };

  const bankLabel = activeBank === 'js-ts' ? 'JavaScript & TypeScript' : 'Playwright Framework';

  // ─── Section detail view ─────────────────────────────────────────
  if (view === 'section' && activeSection) {
    return (
      <div className="space-y-8">
        <SectionView section={activeSection} bankLabel={bankLabel} onBack={goToBank} />
      </div>
    );
  }

  // ─── Bank sections list view ─────────────────────────────────────
  if (view === 'bank') {
    return (
      <div className="space-y-8">
        <BankView bank={activeBank} onBack={goHome} onOpenSection={openSection} isPaidUser={isPaidUser} />
      </div>
    );
  }

  // ─── Home view (two cards) ───────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-brand-600" />
          Interview Preparation
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {allTotalQuestions} curated questions with detailed answers &amp; code examples to ace your interviews.
        </p>
      </div>

      {/* Two Bank Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* JS & TypeScript Card */}
        <Card
          className="border border-slate-200 bg-white cursor-pointer transition-all hover:shadow-sm hover:border-slate-300"
          onClick={() => openBank('js-ts')}
        >
          <CardHeader className="pb-4">
            <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
              <Code2 className="h-7 w-7 text-brand-600" />
            </div>
            <CardTitle className="text-xl">JavaScript & TypeScript</CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Core JS concepts, ES6+, TypeScript types, async patterns, closures, prototypes &amp; more.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-brand-50 text-brand-700 border-brand-200">
                  {INTERVIEW_SECTIONS.length} Sections
                </Badge>
                <Badge variant="outline">
                  {TOTAL_QUESTIONS} Questions
                </Badge>
              </div>
              <ArrowRight className="h-5 w-5 text-brand-600" />
            </div>
          </CardContent>
        </Card>

        {/* Playwright Card */}
        <Card
          className="border border-slate-200 bg-white cursor-pointer transition-all hover:shadow-sm hover:border-slate-300"
          onClick={() => openBank('playwright')}
        >
          <CardHeader className="pb-4">
            <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
              <span className="text-3xl">🎭</span>
            </div>
            <CardTitle className="text-xl">Playwright Framework</CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Selectors, assertions, page objects, API testing, fixtures, parallelism &amp; CI/CD integration.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-brand-50 text-brand-700 border-brand-200">
                  {PLAYWRIGHT_FRAMEWORK_SECTIONS.length} Sections
                </Badge>
                <Badge variant="outline">
                  {TOTAL_PLAYWRIGHT_FRAMEWORK_QUESTIONS} Questions
                </Badge>
              </div>
              <ArrowRight className="h-5 w-5 text-brand-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
