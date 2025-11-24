'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Trophy, AlertCircle, ArrowRight } from 'lucide-react';
import { QuizSubmissionResponse } from '@/types/learning';
import Link from 'next/link';

interface QuizResultsProps {
  results: QuizSubmissionResponse;
  onRetry?: () => void;
  nextLessonUrl?: string | null;
}

export function QuizResults({ results, onRetry, nextLessonUrl }: QuizResultsProps) {
  const { total_questions, correct_answers, score_percentage, passed, results: questionResults } =
    results;

  return (
    <div className="space-y-6 pb-8">
      {/* Overall Results Card */}
      <Card className={`border-2 ${passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {passed ? (
              <div className="bg-green-500 text-white p-4 rounded-full">
                <Trophy className="h-12 w-12" />
              </div>
            ) : (
              <div className="bg-red-500 text-white p-4 rounded-full">
                <AlertCircle className="h-12 w-12" />
              </div>
            )}
          </div>
          <CardTitle className="text-3xl font-bold">
            {passed ? 'Excellent Work!' : 'Quiz Complete!'}
          </CardTitle>
          <p className="text-lg text-muted-foreground mt-2">
            {passed
              ? 'Great job! You scored above 80%. You can move on to the next lesson.'
              : 'You need to score 80% or higher to unlock the next lesson. Retry the quiz to improve your score.'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-sky-600">{score_percentage}%</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{correct_answers}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">
                {total_questions - correct_answers}
              </p>
              <p className="text-sm text-muted-foreground">Incorrect</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {passed ? (
              <>
                {nextLessonUrl && (
                  <Button asChild className="flex-1 bg-sky-600 hover:bg-sky-700">
                    <Link href={nextLessonUrl}>
                      Next Lesson
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
                <Button onClick={onRetry} variant="outline" className="flex-1">
                  Retry Quiz
                </Button>
              </>
            ) : (
              <Button onClick={onRetry} className="w-full bg-sky-600 hover:bg-sky-700">
                Retry Quiz to Unlock Next Lesson
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Question Review</h3>
        {questionResults.map((result, index) => (
          <Card key={result.question_id} className="border-2">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  Q{index + 1}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium leading-relaxed">{result.question_text}</p>
                </div>
                {result.is_correct ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                )}
              </div>

              <div className="pl-11 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground min-w-[100px]">
                    Your answer:
                  </span>
                  <Badge
                    variant={result.is_correct ? 'default' : 'destructive'}
                    className={result.is_correct ? 'bg-green-600' : 'bg-red-600'}
                  >
                    {result.user_answer}
                  </Badge>
                </div>

                {!result.is_correct && (
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-muted-foreground min-w-[100px]">
                      Correct answer:
                    </span>
                    <Badge variant="default" className="bg-green-600">
                      {result.correct_answer}
                    </Badge>
                  </div>
                )}

                <div className="bg-blue-50 border-l-4 border-sky-500 p-3 rounded-r-md">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-sky-700">Explanation: </span>
                    {result.explanation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
