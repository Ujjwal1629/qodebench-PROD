'use client';

import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export function QuizProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
}: QuizProgressProps) {
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Question</span>
          <Badge variant="outline" className="font-semibold">
            {currentQuestion} / {totalQuestions}
          </Badge>
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          {answeredQuestions} answered
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
}
