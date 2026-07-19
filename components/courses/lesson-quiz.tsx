'use client';

import { useMemo, useState } from 'react';
import { Check, X, RotateCcw, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MCQ } from '@/lib/course-content/ai-testing-mcqs';

interface LessonQuizProps {
  questions: MCQ[];
}

export function LessonQuiz({ questions }: LessonQuizProps) {
  // Per-question selected option index; undefined = not answered yet.
  const [answers, setAnswers] = useState<Record<number, number>>({});
  // Bump to force a fresh render/reset.
  const [attempt, setAttempt] = useState(0);

  const answeredCount = Object.keys(answers).length;
  const score = useMemo(
    () =>
      Object.entries(answers).reduce(
        (acc, [i, sel]) => acc + (questions[Number(i)]?.correctIndex === sel ? 1 : 0),
        0
      ),
    [answers, questions]
  );
  const allAnswered = answeredCount === questions.length && questions.length > 0;

  const select = (qi: number, oi: number) => {
    // Lock the answer once chosen — no changing after seeing the result.
    if (answers[qi] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qi]: oi }));
  };

  const reset = () => {
    setAnswers({});
    setAttempt((a) => a + 1);
  };

  if (questions.length === 0) {
    return (
      <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-2xl">
        Practice questions for this session will appear here soon — check your understanding
        of the lecture with a quick 5–10 question quiz.
      </p>
    );
  }

  return (
    <div key={attempt} className="max-w-3xl space-y-5">
      {/* Progress / score header */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-3">
        <div className="text-[13px] text-slate-600">
          {allAnswered ? (
            <span className="font-semibold text-slate-900">
              Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
            </span>
          ) : (
            <span>
              Answered <span className="font-semibold text-slate-900">{answeredCount}</span> of{' '}
              {questions.length}
            </span>
          )}
        </div>
        {answeredCount > 0 && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-brand-600 hover:text-brand-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      {questions.map((q, qi) => {
        const selected = answers[qi];
        const isAnswered = selected !== undefined;
        return (
          <div key={qi} className="rounded-lg border border-slate-200 p-4">
            <p className="flex gap-2 text-[14px] font-semibold text-slate-900 leading-snug">
              <span className="text-slate-400 font-mono text-[12.5px] mt-px shrink-0">
                {qi + 1}.
              </span>
              <span>{q.question}</span>
            </p>

            <div className="mt-3 space-y-2">
              {q.options.map((opt, oi) => {
                const isCorrect = oi === q.correctIndex;
                const isChosen = selected === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => select(qi, oi)}
                    disabled={isAnswered}
                    className={cn(
                      'w-full flex items-start gap-2.5 rounded-md border px-3 py-2 text-left text-[13px] leading-snug transition-colors',
                      !isAnswered && 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/40',
                      isAnswered && isCorrect && 'border-emerald-300 bg-emerald-50 text-emerald-900',
                      isAnswered &&
                        isChosen &&
                        !isCorrect &&
                        'border-red-300 bg-red-50 text-red-900',
                      isAnswered && !isCorrect && !isChosen && 'border-slate-200 text-slate-500'
                    )}
                  >
                    <span
                      className={cn(
                        'mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold',
                        !isAnswered && 'border-slate-300 text-slate-400',
                        isAnswered && isCorrect && 'border-emerald-500 bg-emerald-500 text-white',
                        isAnswered &&
                          isChosen &&
                          !isCorrect &&
                          'border-red-500 bg-red-500 text-white',
                        isAnswered && !isCorrect && !isChosen && 'border-slate-300 text-slate-400'
                      )}
                    >
                      {isAnswered && isCorrect ? (
                        <Check className="h-3 w-3" />
                      ) : isAnswered && isChosen && !isCorrect ? (
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

            {isAnswered && (
              <div className="mt-3 flex gap-2 rounded-md bg-slate-50 border border-slate-100 px-3 py-2.5">
                <HelpCircle className="h-4 w-4 text-brand-600 shrink-0 mt-px" />
                <p className="text-[12.5px] text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900">
                    {selected === q.correctIndex ? 'Correct. ' : 'Not quite. '}
                  </span>
                  {q.explanation}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
