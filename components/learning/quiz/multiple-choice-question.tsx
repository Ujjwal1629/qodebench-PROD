'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code } from 'lucide-react';

interface MultipleChoiceQuestionProps {
  question: {
    id: string;
    question_text: string;
    options?: Record<string, string>;
    code_example?: string | null;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  selectedAnswer?: string;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
}

export function MultipleChoiceQuestion({
  question,
  selectedAnswer,
  onAnswerChange,
  disabled = false,
}: MultipleChoiceQuestionProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  return (
    <Card className="border-2">
      <CardContent className="pt-4 sm:pt-6 space-y-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
          <p className="text-base sm:text-lg font-medium leading-relaxed break-words flex-1">{question.question_text}</p>
          <Badge className={`${difficultyColors[question.difficulty]} text-xs sm:text-sm flex-shrink-0`}>{question.difficulty}</Badge>
        </div>

        {question.code_example && (
          <div className="bg-slate-950 text-slate-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Code className="h-4 w-4" />
              <span className="text-xs font-medium text-slate-400">Code Example</span>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code>{question.code_example}</code>
            </pre>
          </div>
        )}

        <RadioGroup
          value={selectedAnswer}
          onValueChange={onAnswerChange}
          disabled={disabled}
          className="space-y-2 sm:space-y-3"
        >
          {question.options && Object.entries(question.options).map(([key, value]) => (
            <div
              key={key}
              onClick={() => !disabled && onAnswerChange(key)}
              className={`flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg border-2 transition-colors ${
                selectedAnswer === key
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-border hover:border-sky-200 hover:bg-sky-50/50'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <RadioGroupItem value={key} id={`${question.id}-${key}`} disabled={disabled} className="mt-0.5 flex-shrink-0" />
              <Label
                htmlFor={`${question.id}-${key}`}
                className="flex-1 cursor-pointer font-normal text-sm sm:text-base break-words"
              >
                <span className="font-semibold text-sky-600 mr-1 sm:mr-2">{key}.</span>
                {value}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
