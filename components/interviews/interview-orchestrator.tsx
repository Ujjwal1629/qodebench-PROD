'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import MCQStage from './stages/mcq-stage';
import VoiceQAStage from './stages/voice-qa-stage';
import CodingStage from './stages/coding-stage';
import TextQAStage from './stages/text-qa-stage';
import DiscussionStage from './stages/discussion-stage';
import ResultsStage from './stages/results-stage';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface InterviewSession {
  id: string;
  user_id: string;
  experience_level: 'fresher' | 'junior' | 'senior';
  current_stage: string;
  status: string;
  stage_scores: Record<string, number>;
  stage_completion_times: Record<string, string>;
}

interface InterviewOrchestratorProps {
  sessionId: string;
}

const stageInfo = [
  { key: 'stage_1_mcq', title: 'MCQ Assessment', number: 1 },
  { key: 'stage_2_voice_qa', title: 'Behavioral Q&A', number: 2 },
  { key: 'stage_3_coding', title: 'Live Coding', number: 3 },
  { key: 'stage_4_text_qa', title: 'Technical Concepts', number: 4 },
  { key: 'stage_5_discussion', title: 'System Design', number: 5 },
  { key: 'stage_6_results', title: 'Results & Report', number: 6 },
];

export default function InterviewOrchestrator({ sessionId }: InterviewOrchestratorProps) {
  const router = useRouter();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/interview/session/${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch session');

        const data = await response.json();
        setSession(data.session);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching session:', error);
        toast.error('Failed to load interview session');
        router.push('/dashboard/interviews');
      }
    };

    fetchSession();
  }, [sessionId, router]);

  // Warn user before leaving the page (browser navigation)
  useEffect(() => {
    if (!session || session.status === 'completed') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Your interview progress will be lost if you leave this page. Are you sure you want to exit?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session]);

  const handleStageComplete = async (score?: number) => {
    // Refresh session data to get updated current_stage
    try {
      const response = await fetch(`/api/interview/session/${sessionId}`);
      if (!response.ok) throw new Error('Failed to refresh session');

      const data = await response.json();
      setSession(data.session);

      // Scroll to top when stage changes
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Show success message
      if (score !== undefined) {
        toast.success(`Stage completed! Score: ${score}/10`);
      } else {
        toast.success('Stage completed!');
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  if (isLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium">Loading interview...</p>
        </div>
      </div>
    );
  }

  const currentStageIndex = stageInfo.findIndex((s) => s.key === session.current_stage);
  const completedStages = currentStageIndex;
  const progress = ((completedStages) / 6) * 100;

  return (
    <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
      {/* Warning Banner */}
      {session.status !== 'completed' && (
        <Card className="mb-4 sm:mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-semibold text-amber-900 dark:text-amber-100">Important: Do Not Navigate Away</h3>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 mt-1">
                Your interview progress will be lost if you navigate away from this page or close your browser.
                Please complete the entire interview in one session. Estimated time: 45-60 minutes.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Header with Progress */}
      <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                Full-Stack Developer Interview
              </h1>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                <span>Experience Level:</span>
                <Badge variant="secondary" className="capitalize text-xs">
                  {session.experience_level}
                </Badge>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                {completedStages}/6
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Stages Completed</p>
            </div>
          </div>

          <Progress value={progress} className="h-2 sm:h-3" />

          {/* Stage Progress Indicators */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {stageInfo.map((stage, index) => (
              <div
                key={stage.key}
                className={`text-center p-1.5 sm:p-2 rounded-lg text-[10px] sm:text-xs ${
                  index < completedStages
                    ? 'bg-green-100 text-green-700'
                    : index === completedStages
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {index < completedStages ? (
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mx-auto mb-0.5 sm:mb-1" />
                ) : (
                  <span className="font-bold">{stage.number}</span>
                )}
                <p className="leading-tight line-clamp-2">{stage.title}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Current Stage Component */}
      <div>
        {session.current_stage === 'stage_1_mcq' && (
          <MCQStage
            sessionId={sessionId}
            experienceLevel={session.experience_level}
            onComplete={handleStageComplete}
          />
        )}

        {session.current_stage === 'stage_2_voice_qa' && (
          <VoiceQAStage
            sessionId={sessionId}
            experienceLevel={session.experience_level}
            onComplete={handleStageComplete}
          />
        )}

        {session.current_stage === 'stage_3_coding' && (
          <CodingStage
            sessionId={sessionId}
            experienceLevel={session.experience_level}
            onComplete={handleStageComplete}
          />
        )}

        {session.current_stage === 'stage_4_text_qa' && (
          <TextQAStage
            sessionId={sessionId}
            experienceLevel={session.experience_level}
            onComplete={handleStageComplete}
          />
        )}

        {session.current_stage === 'stage_5_discussion' && (
          <DiscussionStage
            sessionId={sessionId}
            experienceLevel={session.experience_level}
            onComplete={handleStageComplete}
          />
        )}

        {session.current_stage === 'stage_6_results' && (
          <ResultsStage sessionId={sessionId} />
        )}
      </div>
    </div>
  );
}
