'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Clock,
  BookOpen,
  Send,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Mic,
  MicOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

interface TextQAQuestion {
  id: string;
  question_text: string;
  question_type: string;
  expected_answer: string;
  key_concepts: string[];
  max_score: number;
}

interface TextQAStageProps {
  sessionId: string;
  experienceLevel: 'fresher' | 'junior' | 'senior';
  onComplete: () => void;
}

export default function TextQAStage({ sessionId, experienceLevel, onComplete }: TextQAStageProps) {
  const [questions, setQuestions] = useState<TextQAQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const totalTime = experienceLevel === 'senior' ? 1200 : 1500; // 20 min senior, 25 min others

  // Use refs to track current question for speech recognition
  const questionsRef = useRef(questions);
  const currentQuestionIndexRef = useRef(currentQuestionIndex);

  // Update refs when values change
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    onResult: (transcript) => {
      const question = questionsRef.current[currentQuestionIndexRef.current];
      if (question) {
        setResponses((prev) => ({
          ...prev,
          [question.id]: transcript,
        }));
      }
    },
    continuous: true,
    interimResults: true,
  });

  const currentQuestion = questions[currentQuestionIndex];

  // Stop listening and scroll to top when question changes
  useEffect(() => {
    if (isListening) {
      stopListening();
    }
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/interview/stages/text-qa/questions', {
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
        toast.error('Failed to load questions');
      }
    };

    fetchQuestions();
  }, [sessionId, experienceLevel, totalTime]);

  // Timer
  useEffect(() => {
    if (!hasStarted || timeLeft <= 0 || isSubmitting) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, timeLeft, isSubmitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Check if all questions are answered
    const unansweredQuestions = questions.filter(
      (q) => !responses[q.id] || responses[q.id].trim() === ''
    );

    if (unansweredQuestions.length > 0) {
      toast.error(`Please answer all questions (${unansweredQuestions.length} remaining)`);
      return;
    }

    setIsSubmitting(true);

    try {
      const allResponses = questions.map((q) => ({
        question_id: q.id,
        response: responses[q.id] || '',
      }));

      const response = await fetch('/api/interview/stages/text-qa/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          responses: allResponses,
          timeTaken: totalTime - timeLeft,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit responses');

      const data = await response.json();
      toast.success('Stage 4 completed successfully!');

      // Reset submitting state before calling onComplete
      setIsSubmitting(false);
      onComplete();
    } catch (error) {
      console.error('Error submitting responses:', error);
      toast.error('Failed to submit responses');
      setIsSubmitting(false);
    }
  };

  if (isLoading || questions.length === 0) {
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
      <Card className="p-8 max-w-3xl mx-auto">
        <div className="text-center space-y-6">
          <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="h-10 w-10 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Stage 4: Technical Concepts Q&A</h2>
            <p className="text-muted-foreground">
              Demonstrate your understanding of core technical concepts
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg space-y-3 text-left">
            <h3 className="font-semibold text-lg mb-4">What to expect:</h3>
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium">Questions</p>
                <p className="text-sm text-muted-foreground">
                  {questions.length} technical concept questions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium">Time Limit</p>
                <p className="text-sm text-muted-foreground">
                  {Math.floor(totalTime / 60)} minutes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium">Tips</p>
                <p className="text-sm text-muted-foreground">
                  Write clear, concise answers covering key concepts and real-world examples
                </p>
              </div>
            </div>
          </div>

          <Button onClick={() => setHasStarted(true)} size="lg" className="w-full max-w-xs">
            Start Technical Q&A
          </Button>
        </div>
      </Card>
    );
  }

  const answeredCount = Object.values(responses).filter((r) => r && r.trim() !== '').length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="space-y-4">
      {/* Header with Timer and Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold">Technical Concepts Q&A</h2>
            <Badge variant="secondary" className="capitalize mt-1">
              {experienceLevel} Level
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Answered</p>
              <p className="text-lg font-bold">
                {answeredCount}/{questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span
                  className={`text-2xl font-bold ${
                    timeLeft < 300 ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Time Remaining</p>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </Card>

      {/* Question Card */}
      <Card className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
            <Badge variant="secondary">{currentQuestion.question_type}</Badge>
          </div>
          <h3 className="text-lg font-semibold mb-4">{currentQuestion.question_text}</h3>

          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm font-medium mb-2 text-blue-900">
              Key concepts to cover:
            </p>
            <div className="flex flex-wrap gap-2">
              {currentQuestion.key_concepts.map((concept, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {concept}
                </Badge>
              ))}
            </div>
          </div>

          {/* Voice Input Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium text-sm">Your Answer</label>
              <Button
                variant={isListening ? 'destructive' : 'outline'}
                size="sm"
                onClick={handleToggleVoice}
                disabled={isSubmitting}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Start Voice Input
                  </>
                )}
              </Button>
            </div>

            {isListening && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-red-900">
                    Listening... Speak clearly into your microphone
                  </p>
                </div>
              </div>
            )}

            <Textarea
              value={responses[currentQuestion.id] || ''}
              onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here... or use voice input"
              className="min-h-[300px] text-base"
              disabled={isSubmitting}
              onCopy={(e) => {
                e.preventDefault();
                toast.error('Copying is disabled during the interview');
              }}
              onCut={(e) => {
                e.preventDefault();
                toast.error('Cutting is disabled during the interview');
              }}
              onPaste={(e) => {
                e.preventDefault();
                toast.error('Pasting is disabled during the interview');
              }}
            />

            <div className="text-sm text-muted-foreground">
              Word count: {(responses[currentQuestion.id] || '').split(/\s+/).filter(Boolean).length}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0 || isSubmitting}
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                disabled={isSubmitting}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  idx === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : responses[questions[idx].id]
                    ? 'bg-green-100 text-green-700 border-2 border-green-500'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || answeredCount < questions.length}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Answers
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))
              }
              disabled={isSubmitting}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>

      {/* Quick Tips */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900 mb-1">Writing Tips</p>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Cover all key concepts mentioned in the blue box</li>
              <li>• Include real-world examples or use cases</li>
              <li>• Explain trade-offs and considerations</li>
              <li>• Aim for 100-200 words per answer</li>
            </ul>
          </div>
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
