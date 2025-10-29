'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ArrowRight, BookOpen } from 'lucide-react';
import { getRecommendationMessage } from '@/lib/quiz-questions';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  experienceLevel: 'intern' | 'junior' | 'mid' | 'senior' | null;
}

export function QuizResults({ score, totalQuestions, correctAnswers, experienceLevel }: QuizResultsProps) {
  const recommendation = getRecommendationMessage(score);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          {recommendation.shouldRedirectToLearning ? (
            <BookOpen className="h-16 w-16 text-orange-500" />
          ) : (
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          )}
        </div>
        <CardTitle className="text-3xl">{recommendation.title}</CardTitle>
        <CardDescription className="text-base">
          {recommendation.message}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center space-y-2">
          <div className="text-6xl font-bold text-primary">{score}%</div>
          <p className="text-muted-foreground">
            You answered {correctAnswers} out of {totalQuestions} questions correctly
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={score} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Experience Level Badge */}
        {experienceLevel && (
          <div className="flex items-center justify-center gap-2 p-4 bg-primary/10 rounded-lg">
            <span className="text-sm font-medium">Your Level:</span>
            <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold capitalize">
              {experienceLevel}
            </span>
          </div>
        )}

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <div className="text-sm font-medium">Correct</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{correctAnswers}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <div className="text-sm font-medium">Incorrect</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {totalQuestions - correctAnswers}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        {recommendation.shouldRedirectToLearning ? (
          <Button size="lg" asChild className="gap-2">
            <Link href="/dashboard/learning">
              Continue to Learning
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button size="lg" asChild className="gap-2">
            <Link href="/dashboard">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
