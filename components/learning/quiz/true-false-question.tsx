'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface TrueFalseQuestionProps {
  question: {
    id: string;
    question_text: string;
    code_example?: string | null;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  selectedAnswer?: string;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
}

export function TrueFalseQuestion({
  question,
  selectedAnswer,
  onAnswerChange,
  disabled = false,
}: TrueFalseQuestionProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  return (
    <Card className="border-2">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <p className="text-lg font-medium leading-relaxed">{question.question_text}</p>
          <Badge className={difficultyColors[question.difficulty]}>{question.difficulty}</Badge>
        </div>

        {question.code_example && (
          <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              <code>{question.code_example}</code>
            </pre>
          </div>
        )}

        <RadioGroup
          value={selectedAnswer}
          onValueChange={onAnswerChange}
          disabled={disabled}
          className="grid grid-cols-2 gap-4"
        >
          <div
            onClick={() => !disabled && onAnswerChange('true')}
            className={`flex items-center justify-center space-x-3 p-6 rounded-lg border-2 transition-colors ${
              selectedAnswer === 'true'
                ? 'border-green-500 bg-green-50'
                : 'border-border hover:border-green-200 hover:bg-green-50/50'
            } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <RadioGroupItem value="true" id={`${question.id}-true`} disabled={disabled} />
            <Label
              htmlFor={`${question.id}-true`}
              className="flex items-center gap-2 cursor-pointer font-medium text-base"
            >
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              True
            </Label>
          </div>

          <div
            onClick={() => !disabled && onAnswerChange('false')}
            className={`flex items-center justify-center space-x-3 p-6 rounded-lg border-2 transition-colors ${
              selectedAnswer === 'false'
                ? 'border-red-500 bg-red-50'
                : 'border-border hover:border-red-200 hover:bg-red-50/50'
            } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <RadioGroupItem value="false" id={`${question.id}-false`} disabled={disabled} />
            <Label
              htmlFor={`${question.id}-false`}
              className="flex items-center gap-2 cursor-pointer font-medium text-base"
            >
              <XCircle className="h-5 w-5 text-red-600" />
              False
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
