'use client';

import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

export function QuizProgress({ currentQuestion, totalQuestions }: QuizProgressProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-muted-foreground">
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span className="font-semibold text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
