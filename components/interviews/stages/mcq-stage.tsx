'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface MCQQuestion {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  category: string;
  difficulty_score: number;
}

interface MCQStageProps {
  sessionId: string;
  experienceLevel: 'fresher' | 'junior' | 'senior';
  onComplete: (score: number) => void;
}

export default function MCQStage({ sessionId, experienceLevel, onComplete }: MCQStageProps) {
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Set timer based on experience level
  const totalTime = experienceLevel === 'senior' ? 12 * 60 : 15 * 60; // seconds

  // Fetch MCQ questions
  useEffect(() => {
    // Scroll to top when stage loads
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/interview/stages/mcq/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, experienceLevel }),
        });

        if (!response.ok) throw new Error('Failed to fetch questions');

        const data = await response.json();
        setQuestions(data.questions);
        setTimeLeft(totalTime);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        alert('Failed to load questions. Please try again.');
      }
    };

    fetchQuestions();
  }, [sessionId, experienceLevel, totalTime]);

  // Start timer when user clicks start
  const startQuiz = () => {
    setHasStarted(true);
    // Scroll to top when quiz starts
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Timer countdown
  useEffect(() => {
    if (!hasStarted || timeLeft <= 0 || isSubmitting) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, timeLeft, isSubmitting]);

  const handleAnswerChange = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/interview/stages/mcq/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answers,
          timeTaken: totalTime - timeLeft,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit answers');

      const data = await response.json();

      // Reset submitting state before calling onComplete
      setIsSubmitting(false);
      onComplete(data.score);
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Failed to submit answers. Please try again.');
      setIsSubmitting(false);
    }
  }, [sessionId, answers, timeLeft, totalTime, onComplete, isSubmitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <Card className="p-4 sm:p-8 max-w-2xl mx-auto">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="bg-blue-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Stage 1: Multiple Choice Questions</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Test your knowledge with {questions.length} questions
            </p>
          </div>

          <div className="bg-slate-50 p-4 sm:p-6 rounded-lg space-y-3 text-left">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Instructions:</h3>
            <div className="flex items-start gap-2 sm:gap-3">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm sm:text-base font-medium">Time Limit</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {experienceLevel === 'senior' ? '12' : '15'} minutes total
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm sm:text-base font-medium">Total Questions</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{questions.length} questions</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm sm:text-base font-medium">Auto-Submit</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Quiz will auto-submit when time expires
                </p>
              </div>
            </div>
          </div>

          <Button onClick={startQuiz} size="lg" className="w-full max-w-xs">
            Start Quiz
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Timer and Progress */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">MCQ Assessment</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Answer all {questions.length} questions
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
              <span
                className={`text-xl sm:text-2xl font-bold ${
                  timeLeft < 60 ? 'text-red-600' : 'text-blue-600'
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground text-right">Time Remaining</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Progress</span>
            <span className="font-medium">
              {answeredCount} / {questions.length} answered
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      {/* Questions */}
      <div className="space-y-3 sm:space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <Badge variant="outline" className="text-xs">Question {index + 1}</Badge>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {question.category.replace('_', ' ')}
                    </Badge>
                    {answers[question.id] && (
                      <Badge variant="default" className="bg-green-600 text-xs">
                        <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                        Answered
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                    {question.question_text}
                  </p>
                </div>
              </div>

              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                className="space-y-2 sm:space-y-3"
              >
                {['a', 'b', 'c', 'd'].map((option) => (
                  <div
                    key={option}
                    className={`flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-blue-300 ${
                      answers[question.id] === option
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <RadioGroupItem value={option} id={`${question.id}-${option}`} className="mt-0.5" />
                    <Label
                      htmlFor={`${question.id}-${option}`}
                      className="flex-1 cursor-pointer font-normal text-xs sm:text-sm"
                    >
                      <span className="font-semibold uppercase mr-1.5 sm:mr-2">{option}.</span>
                      {question[`option_${option}` as keyof MCQQuestion]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <Card className="p-4 sm:p-6 sticky bottom-2 sm:bottom-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm sm:text-base font-medium">
              {answeredCount === questions.length ? (
                <span className="text-green-600 flex items-center justify-center sm:justify-start gap-2">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  All questions answered!
                </span>
              ) : (
                <span className="text-amber-600 flex items-center justify-center sm:justify-start gap-2">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  {questions.length - answeredCount} questions remaining
                </span>
              )}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {answeredCount === questions.length
                ? 'You can now submit your answers'
                : 'Please answer all questions to submit'}
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || answeredCount < questions.length}
            size="lg"
            className="w-full sm:w-auto sm:min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Answers'
            )}
          </Button>
        </div>
      </Card>

      {/* Full-page Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" style={{ marginTop: "auto" }}>
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
            <div className="text-center">
              <p className="text-xl font-semibold mb-2">Submitting Your Answers...</p>
              <p className="text-sm text-muted-foreground">Please wait while we evaluate your responses</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
