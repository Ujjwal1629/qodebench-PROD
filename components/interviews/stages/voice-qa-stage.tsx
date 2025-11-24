'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Loader2, CheckCircle2, ArrowRight, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { useWhisperRecording } from '@/hooks/use-whisper-recording';

interface VoiceQAQuestion {
  id: string;
  question_text: string;
  question_type: string;
  expected_points: string[];
}

interface VoiceQAStageProps {
  sessionId: string;
  experienceLevel: 'fresher' | 'junior' | 'senior';
  onComplete: () => void;
}

export default function VoiceQAStage({ sessionId, experienceLevel, onComplete }: VoiceQAStageProps) {
  const [questions, setQuestions] = useState<VoiceQAQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');

  const { isRecording, isTranscribing, startRecording, stopRecording } = useWhisperRecording({
    onTranscript: (transcript) => {
      setCurrentResponse(transcript);
    },
    continuous: false, // Each recording is separate for better accuracy
  });

  // Fetch Voice Q&A questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/interview/stages/voice-qa/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, experienceLevel }),
        });

        if (!response.ok) throw new Error('Failed to fetch questions');

        const data = await response.json();
        setQuestions(data.questions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Failed to load questions');
      }
    };

    fetchQuestions();
  }, [sessionId, experienceLevel]);

  const currentQuestion = questions[currentIndex];

  const handleToggleVoice = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSpeakQuestion = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question_text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in your browser');
    }
  };

  const handleNext = () => {
    if (!currentResponse.trim()) {
      toast.error('Please provide an answer before continuing');
      return;
    }

    // Save current response
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: currentResponse,
    }));

    setCurrentResponse('');

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All questions answered, submit
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const allResponses = {
        ...responses,
        [currentQuestion.id]: currentResponse,
      };

      const response = await fetch('/api/interview/stages/voice-qa/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          responses: allResponses,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit responses');

      const data = await response.json();
      toast.success('Stage 2 completed successfully!');

      // Reset submitting state before calling onComplete
      setIsSubmitting(false);
      onComplete();
    } catch (error) {
      console.error('Error submitting responses:', error);
      toast.error('Failed to submit responses');
      setIsSubmitting(false);
    }
  };

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

  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No questions available</p>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress */}
      <Card className="p-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Stage 2: Behavioral Q&A</span>
            <span className="text-muted-foreground">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      {/* Question */}
      <Card className="p-8">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="capitalize">
                {currentQuestion.question_type}
              </Badge>
              <Badge variant="secondary">
                Question {currentIndex + 1}/{questions.length}
              </Badge>
            </div>

            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-semibold leading-relaxed">
                {currentQuestion.question_text}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeakQuestion}
                title="Listen to question"
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Key Points to Cover */}
          {currentQuestion.expected_points && currentQuestion.expected_points.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-sm text-blue-900 mb-2">Key points to cover:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                {currentQuestion.expected_points.slice(0, 3).map((point, idx) => (
                  <li key={idx}>• {point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Answer Input with Voice */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium">Your Answer</label>
              <Button
                variant={isRecording ? 'destructive' : 'outline'}
                size="sm"
                onClick={handleToggleVoice}
                disabled={isTranscribing}
              >
                {isRecording ? (
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

            {isRecording && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-red-900">
                    Recording... Speak clearly
                  </p>
                </div>
              </div>
            )}

            {isTranscribing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                  <p className="text-sm font-medium text-blue-900">
                    Processing your response...
                  </p>
                </div>
              </div>
            )}

            <Textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Type your answer here... or use voice input"
              className="min-h-[200px]"
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

            {/* Character count */}
            <div className="text-sm text-muted-foreground text-right">
              {currentResponse.length} characters
            </div>

            {/* STAR Method Guide */}
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="font-medium text-sm text-amber-900 mb-2">💡 STAR Method Tip:</p>
              <ul className="text-sm text-amber-800 space-y-1">
                <li><strong>S</strong>ituation: Describe the context</li>
                <li><strong>T</strong>ask: Explain your responsibility</li>
                <li><strong>A</strong>ction: Detail what you did</li>
                <li><strong>R</strong>esult: Share the outcome</li>
              </ul>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                {currentResponse.trim() ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Answer provided
                  </span>
                ) : (
                  <span>Please provide your answer</span>
                )}
              </div>
              <Button
                onClick={handleNext}
                disabled={!currentResponse.trim() || isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  'Complete Stage 2'
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <h3 className="font-semibold mb-3">Interview Tips</h3>
        <ul className="text-sm space-y-2 text-slate-700">
          <li>• Use the STAR method: Situation, Task, Action, Result</li>
          <li>• Be specific with examples from your experience</li>
          <li>• Focus on your personal contributions and learnings</li>
          <li>• Take your time - quality over speed</li>
        </ul>
      </Card>

      {/* Full-page Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" style={{ marginTop: "auto" }}>
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
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
