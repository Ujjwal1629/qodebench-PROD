'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { getRecommendationMessage } from '@/lib/quiz-questions';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  experienceLevel: 'intern' | 'junior' | 'mid' | 'senior' | null;
}

export function QuizResults({ score, totalQuestions, correctAnswers, experienceLevel }: QuizResultsProps) {
  const recommendation = getRecommendationMessage(score);
  const router = useRouter();

  const handleGoToDashboard = () => {
    // Clear quiz results from sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('quiz_results');
    }
    // Use full page navigation to ensure middleware gets fresh profile data
    // This clears the profile cache cookie and fetches fresh from DB
    window.location.href = '/dashboard';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center space-y-3">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className={`h-16 w-16 ${score >= 60 ? 'text-green-500' : 'text-orange-500'}`} />
        </div>
        <CardTitle className="text-3xl">{recommendation.title}</CardTitle>
        <CardDescription className="text-base">
          {recommendation.message}
        </CardDescription>

        {/* Guidance Section */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {recommendation.guidance}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center space-y-2">
          <div className={`text-6xl font-bold ${score >= 60 ? 'text-green-600' : 'text-orange-600'}`}>
            {score}%
          </div>
          <p className="text-muted-foreground">
            You answered {correctAnswers} out of {totalQuestions} questions correctly
          </p>
        </div>

        {/* Progress Bar with Threshold Marker */}
        <div className="space-y-2">
          <div className="relative">
            <Progress value={score} className="h-3" />
            {/* 60% threshold marker */}
            <div className="absolute top-0 h-3" style={{ left: '60%' }}>
              <div className="w-0.5 h-full bg-slate-400 -translate-x-1/2"></div>
            </div>
          </div>
          <div className="relative flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span className="absolute" style={{ left: '60%', transform: 'translateX(-50%)' }}>
              <span className="text-xs font-medium text-slate-600 whitespace-nowrap">60%</span>
            </span>
            <span>100%</span>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground italic">
              {score >= 60
                ? '✓ Strong foundation - ready for challenges'
                : '📚 Build your foundation with learning modules first'}
            </p>
          </div>
        </div>

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
        <Button size="lg" onClick={handleGoToDashboard} className="gap-2">
          Continue to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
