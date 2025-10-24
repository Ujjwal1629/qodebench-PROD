'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import VoiceRecorder from './voice-recorder';
import HintPanel from './hint-panel';
import {
  getCurrentQuestion,
  submitAnswer,
  completeInterview,
  abandonInterview,
  addAIMessageToTranscript,
  getInterviewSession,
} from '@/app/actions/interviews';
import { Clock, AlertCircle, Volume2, VolumeX, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBrowserSpeech } from '@/lib/utils/speech';

interface InterviewSessionProps {
  sessionId: string;
  initialSession: any;
}

export default function InterviewSession({ sessionId, initialSession }: InterviewSessionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [lastSpokenQuestionId, setLastSpokenQuestionId] = useState<string | null>(null);
  const hasLoadedFirstQuestion = useRef(false);
  const browserSpeech = useRef(getBrowserSpeech());
  const interviewEndedRef = useRef(false); // Track if interview was explicitly ended

  // Fetch live session data with React Query
  const { data: sessionData, refetch: refetchSession } = useQuery({
    queryKey: ['interview-session', sessionId],
    queryFn: async () => {
      const result = await getInterviewSession(sessionId);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    initialData: { session: initialSession, responses: [] },
    refetchOnWindowFocus: false,
  });

  const session = sessionData?.session || initialSession;

  // Auto-abandon interview if user navigates away
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (!interviewEndedRef.current) {
        // Use sendBeacon for reliable async call during page unload
        navigator.sendBeacon(
          '/api/interview/abandon',
          JSON.stringify({ sessionId })
        );
      }
    };

    const handleVisibilityChange = async () => {
      // If user switches tabs/apps for extended period, consider abandoning
      if (document.hidden && !interviewEndedRef.current) {
        // Optional: Could add a timer here to abandon after X minutes hidden
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      // If component unmounts and interview wasn't explicitly ended, abandon it
      if (!interviewEndedRef.current) {
        abandonInterview(sessionId);
      }
    };
  }, [sessionId]);

  // Load first question (only once)
  useEffect(() => {
    if (!hasLoadedFirstQuestion.current) {
      hasLoadedFirstQuestion.current = true;
      loadNextQuestion();
    }
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - questionStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [questionStartTime]);

  const loadNextQuestion = async () => {
    setIsLoadingQuestion(true);
    const result = await getCurrentQuestion(sessionId);

    if (result.error) {
      // No more questions available
      await handleCompleteInterview();
      return;
    }

    setCurrentQuestion(result.data);
    setUserAnswer('');
    setQuestionStartTime(Date.now());
    setElapsedTime(0);
    setIsLoadingQuestion(false);

    // Add AI greeting to transcript
    const greeting = `Here's your next question: ${result.data.question_text}`;
    await addAIMessageToTranscript(sessionId, greeting);

    // Auto-play question with duplicate prevention
    if (result.data.id !== lastSpokenQuestionId) {
      setLastSpokenQuestionId(result.data.id);
      await speakText(greeting);
    }
  };

  const speakText = async (text: string) => {
    // Stop any currently playing audio first
    stopAudio();

    // Check if browser speech is supported
    if (!browserSpeech.current.isSupported()) {
      console.warn('Browser speech not supported, falling back to silent mode');
      return;
    }

    setIsPlayingAudio(true);

    browserSpeech.current.speak(text, {
      rate: 0.9, // Slightly slower for clarity
      pitch: 1.0,
      volume: 1.0,
      onEnd: () => {
        setIsPlayingAudio(false);
      },
      onError: (error) => {
        console.error('Speech error:', error);
        setIsPlayingAudio(false);
      },
    });
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (browserSpeech.current) {
        browserSpeech.current.stop();
      }
    };
  }, []);

  const stopAudio = () => {
    if (browserSpeech.current) {
      browserSpeech.current.stop();
      setIsPlayingAudio(false);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setUserAnswer(text);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) return;

    setIsSubmitting(true);

    const responseTime = elapsedTime;

    // Submit answer
    const result = await submitAnswer({
      sessionId,
      questionId: currentQuestion.id,
      userAnswer,
      responseTimeSeconds: responseTime,
    });

    if (result.error) {
      alert(result.error);
      setIsSubmitting(false);
      return;
    }

    // Refetch session to update progress
    await refetchSession();

    // Evaluate answer (async - happens in background)
    fetch('/api/interview/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responseId: result.data.id, sessionId }),
    });

    // Load next question
    await loadNextQuestion();
    setIsSubmitting(false);
  };

  const handleCompleteInterview = async () => {
    const confirmed = confirm(
      'Are you sure you want to complete the interview? You will receive your detailed report.'
    );

    if (!confirmed) return;

    // Mark interview as explicitly ended
    interviewEndedRef.current = true;

    // Complete interview and generate report
    await completeInterview(sessionId);

    // Generate comprehensive report (async)
    await fetch('/api/interview/generate-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });

    router.push(`/dashboard/interviews/${sessionId}/report`);
  };

  const handleAbandonInterview = async () => {
    const confirmed = confirm(
      'Are you sure you want to exit? Your progress will be saved but the interview will be marked as incomplete.'
    );

    if (!confirmed) return;

    // Mark interview as explicitly ended
    interviewEndedRef.current = true;

    await abandonInterview(sessionId);
    router.push('/dashboard/interviews');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoadingQuestion && !currentQuestion) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium">Loading your interview...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Interview in Progress</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline" className="capitalize">
              {session.interview_type.replace('_', ' ')}
            </Badge>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(elapsedTime)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTranscript(!showTranscript)}>
            {showTranscript ? 'Hide' : 'Show'} Transcript
          </Button>
          <Button variant="ghost" onClick={handleAbandonInterview}>
            Exit Interview
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Question */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">
                      Question {session.questions_answered + 1}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {currentQuestion?.difficulty}
                    </Badge>
                    {currentQuestion?.company !== 'general' && (
                      <Badge variant="outline" className="capitalize">
                        {currentQuestion.company}
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold mb-3">{currentQuestion?.question_text}</h2>

                  {currentQuestion?.context && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                      <p className="text-sm text-blue-900">
                        <strong>Context:</strong> {currentQuestion.context}
                      </p>
                    </div>
                  )}
                </div>

                {!isPlayingAudio ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => currentQuestion && speakText(`Here's your next question: ${currentQuestion.question_text}`)}
                    title="Listen to question"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stopAudio}
                    title="Stop audio"
                  >
                    <VolumeX className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>

              {currentQuestion?.estimated_time_minutes && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Recommended time: {currentQuestion.estimated_time_minutes} minutes</span>
                </div>
              )}
            </div>
          </Card>

          {/* Voice Recorder */}
          <VoiceRecorder onTranscript={handleVoiceTranscript} disabled={isSubmitting} />

          {/* Text Answer (if voice was used) */}
          {userAnswer && (
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Your Answer:</h3>
              <p className="text-sm whitespace-pre-wrap mb-4">{userAnswer}</p>
              <div className="flex gap-2">
                <Button onClick={handleSubmitAnswer} disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setUserAnswer('')} disabled={isSubmitting}>
                  Record Again
                </Button>
              </div>
            </Card>
          )}

          {/* Transcript (if shown) */}
          {showTranscript && (
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Interview Transcript</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {session.transcript?.map((entry: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      entry.role === 'ai' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                    }`}
                  >
                    <p className="text-xs font-medium mb-1">
                      {entry.role === 'ai' ? 'AI Interviewer' : 'You'}
                    </p>
                    <p className="text-sm">{entry.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Session Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Questions Answered</span>
                  <span className="font-medium">{session.questions_answered}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Hints Used</span>
                  <span className="font-medium">{session.hints_used}</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleCompleteInterview}
              >
                Complete Interview
              </Button>
            </div>
          </Card>

          {/* Hints */}
          {currentQuestion && (
            <HintPanel sessionId={sessionId} questionId={currentQuestion.id} />
          )}

          {/* Tips */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Interview Tips
            </h3>
            <ul className="text-sm space-y-2 text-slate-700">
              <li>• Take your time to think before answering</li>
              <li>• Use the STAR method for behavioral questions</li>
              <li>• Explain your thought process clearly</li>
              <li>• Ask for hints if you are stuck (small penalty)</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
