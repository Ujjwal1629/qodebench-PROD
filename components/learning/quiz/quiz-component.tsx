'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { MultipleChoiceQuestion } from './multiple-choice-question';
import { TrueFalseQuestion } from './true-false-question';
import { QuizProgress } from './quiz-progress';
import { QuizResults } from './quiz-results';
import { QuizQuestion, QuizSubmissionResponse } from '@/types/learning';
import { useMutation } from '@tanstack/react-query';

interface QuizComponentProps {
  lessonId: string;
  questions: QuizQuestion[];
  nextLessonUrl?: string | null;
}

export function QuizComponent({ lessonId, questions, nextLessonUrl }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizSubmissionResponse | null>(null);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const allQuestionsAnswered = answeredCount === questions.length;

  const submitQuizMutation = useMutation({
    mutationFn: async (submissionData: {
      lesson_id: string;
      answers: Array<{ question_id: string; user_answer: string }>;
      time_taken_seconds: number;
    }) => {
      const response = await fetch('/api/learning/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      return response.json() as Promise<QuizSubmissionResponse>;
    },
    onSuccess: (data) => {
      setQuizResults(data);
      setShowResults(true);
    },
  });

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);
    const submissionData = {
      lesson_id: lessonId,
      answers: questions.map((q) => ({
        question_id: q.id,
        user_answer: answers[q.id] || '',
      })),
      time_taken_seconds: timeTakenSeconds,
    };

    submitQuizMutation.mutate(submissionData);
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setQuizResults(null);
  };

  if (showResults && quizResults) {
    return (
      <QuizResults results={quizResults} onRetry={handleRetry} nextLessonUrl={nextLessonUrl} />
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
            <span>Quiz Time!</span>
            <span className="text-xs sm:text-sm font-normal text-muted-foreground">
              {questions.length} questions
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <QuizProgress
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            answeredQuestions={answeredCount}
          />

          <div className="space-y-4">
            {currentQuestion.question_type === 'multiple_choice' && (
              <MultipleChoiceQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                selectedAnswer={answers[currentQuestion.id]}
                onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                disabled={submitQuizMutation.isPending}
              />
            )}

            {currentQuestion.question_type === 'true_false' && (
              <TrueFalseQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                selectedAnswer={answers[currentQuestion.id]}
                onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                disabled={submitQuizMutation.isPending}
              />
            )}
          </div>

          {!allQuestionsAnswered && (
            <Alert>
              <AlertDescription className="text-xs sm:text-sm break-words">
                You need to answer all {questions.length} questions before submitting the quiz.
                Progress: {answeredCount}/{questions.length}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 pt-4">
            {/* Question Navigation */}
            <div className="flex justify-center gap-2 flex-wrap">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  disabled={submitQuizMutation.isPending}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-sky-600 text-white'
                      : answers[questions[index].id]
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || submitQuizMutation.isPending}
                className="flex-1 sm:flex-none"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered || submitQuizMutation.isPending}
                  className="bg-sky-600 hover:bg-sky-700 flex-1 sm:flex-none min-w-[140px]"
                >
                  {submitQuizMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Quiz
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={submitQuizMutation.isPending}
                  className="bg-sky-600 hover:bg-sky-700 flex-1 sm:flex-none"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
