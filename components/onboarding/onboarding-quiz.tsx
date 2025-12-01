'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { QuizCard } from '@/components/onboarding/quiz-card';
import { QuizProgress } from '@/components/onboarding/quiz-progress';
import { QuizResults } from '@/components/onboarding/quiz-results';
import { QuizIntro } from '@/components/onboarding/quiz-intro';
import { quizQuestions, getExperienceLevelFromScore } from '@/lib/quiz-questions';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { submitQuizResults, skipOnboarding } from '@/app/actions/onboarding';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';

export function OnboardingQuiz() {
  const searchParams = useSearchParams();
  const step = searchParams.get('step') || 'intro';

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
  const canGoNext = answers[currentQuestionIndex] !== null;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleStart = () => {
    // Use URL-based navigation to preserve browser history
    router.push('/onboarding/quiz?step=quiz');
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await skipOnboarding();

      if (error) {
        throw new Error(error);
      }

      toast({
        title: 'Welcome!',
        description: 'You can always take the assessment later from dashboard.',
      });

      // Optimized navigation with cache refresh
      router.refresh();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      toast({
        title: 'Error',
        description: 'Failed to skip onboarding. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Calculate score
      const correctAnswers = answers.filter(
        (answer, index) => answer === quizQuestions[index].correctAnswer
      ).length;
      const score = Math.round((correctAnswers / quizQuestions.length) * 100);
      const experienceLevel = getExperienceLevelFromScore(score);

      // Submit results to database
      const { error } = await submitQuizResults(score, experienceLevel);

      if (error) {
        throw new Error(error);
      }

      // Navigate to results screen
      router.push('/onboarding/quiz?step=results');

      // Don't auto-redirect - let user click the button
      // User will click button in QuizResults component
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit quiz results. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show intro screen
  if (step === 'intro') {
    return <QuizIntro onStart={handleStart} onSkip={handleSkip} isSkipping={isSubmitting} />;
  }

  // Show results screen
  if (step === 'results') {
    const correctAnswers = answers.filter(
      (answer, index) => answer === quizQuestions[index].correctAnswer
    ).length;
    const score = Math.round((correctAnswers / quizQuestions.length) * 100);
    const experienceLevel = getExperienceLevelFromScore(score);

    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-24 pb-8">
        <QuizResults
          score={score}
          totalQuestions={quizQuestions.length}
          correctAnswers={correctAnswers}
          experienceLevel={experienceLevel}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 pb-8">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Skill Assessment</h1>
          <p className="text-muted-foreground">
            Answer the following questions to help us personalize your experience
          </p>
        </div>

        {/* Progress Bar */}
        <QuizProgress
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={quizQuestions.length}
        />

        {/* Question Card */}
        <QuizCard
          question={currentQuestion}
          selectedAnswer={answers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canGoNext || isSubmitting}
            className="gap-2 min-w-32"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : isLastQuestion ? (
              'Submit'
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
