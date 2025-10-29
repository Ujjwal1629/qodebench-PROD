'use client';

import { QuizQuestion } from '@/lib/quiz-questions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface QuizCardProps {
  question: QuizQuestion;
  selectedAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void;
}

export function QuizCard({ question, selectedAnswer, onAnswerSelect }: QuizCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl leading-relaxed">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
          onValueChange={(value) => onAnswerSelect(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div
              key={`${question.id}-option-${index}`}
              className={cn(
                'flex items-start space-x-3 rounded-lg border p-4 transition-all hover:border-primary cursor-pointer',
                selectedAnswer === index && 'border-primary bg-primary/5'
              )}
              onClick={() => onAnswerSelect(index)}
            >
              <RadioGroupItem
                value={index.toString()}
                id={`q${question.id}-option-${index}`}
                className="mt-0.5 pointer-events-none"
              />
              <Label
                htmlFor={`q${question.id}-option-${index}`}
                className="flex-1 font-normal leading-relaxed pointer-events-none"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
