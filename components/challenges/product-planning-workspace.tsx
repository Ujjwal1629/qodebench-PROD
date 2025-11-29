'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ValidationResultsModal } from './validation-results-modal';
import { BugResolvedCelebration } from './bug-resolved-celebration';
import { AIMentorDock } from './ai-mentor-dock';
import { Loader2, ArrowLeft, MessageSquare, Users, CheckSquare, Lightbulb, Target } from 'lucide-react';
import { toast } from 'sonner';
import { ChallengeMarkdownRenderer } from './challenge-markdown-renderer';
import Link from 'next/link';
import type { ProductPlanningMetadata } from '@/types/challenges';

interface ProductPlanningWorkspaceProps {
  challenge: any;
  metadata: ProductPlanningMetadata;
}

export function ProductPlanningWorkspace({ challenge, metadata }: ProductPlanningWorkspaceProps) {
  const router = useRouter();

  // Extract PM message and team discussion from description
  const extractSection = (description: string, sectionName: string): string => {
    const regex = new RegExp(`##\\s*${sectionName}\\s*\\n\\n([^#]+)`, 'i');
    const match = description?.match(regex);
    return match ? match[1].trim() : '';
  };

  const pmMessage = extractSection(challenge.description || '', 'PM Message');
  const jiraSummary = extractSection(challenge.description || '', 'JIRA Summary');
  const teamDiscussion = extractSection(challenge.description || '', 'Team Discussion');
  const yourTask = extractSection(challenge.description || '', 'Your Task');

  // Get starter placeholder
  const starterPlaceholder = 'Write your feature plan here...';

  // State
  const [answer, setAnswer] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Load saved answer from localStorage (client-side only)
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedAnswer = localStorage.getItem(`challenge_answer_${challenge.id}`);
      if (savedAnswer) {
        setAnswer(savedAnswer);
      }
    }
  }, [challenge.id]);

  // Auto-save to localStorage
  useEffect(() => {
    if (!isClient) return; // Don't save on initial server render

    setIsSaving(true);
    const saveTimer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`challenge_answer_${challenge.id}`, answer);
      }
      setIsSaving(false);
    }, 500);

    return () => clearTimeout(saveTimer);
  }, [answer, challenge.id, isClient]);

  const handleValidate = async () => {
    if (!answer.trim()) {
      toast.error('Please write your feature plan first!');
      return;
    }

    if (answer.trim().length < 50) {
      toast.error('Please provide a more detailed plan (at least 50 characters).');
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch('/api/ai/validate-hybrid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          code: answer,
          language: 'text',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Validation failed');
      }

      const result = await response.json();
      setValidationResult(result);
      setShowValidationModal(true);

      localStorage.setItem(`validation_${challenge.id}`, JSON.stringify({
        answer,
        score: result.score,
        timestamp: Date.now(),
      }));
    } catch (error: any) {
      console.error('Error validating answer:', error);
      toast.error('Validation failed', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!validationResult) {
      toast.error('Please validate your plan first!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/challenges/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          code: answer,
          language: 'text',
          validationResult,
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const result = await response.json();
      setHasSubmitted(true);
      setSubmissionResult(result);
      setShowValidationModal(false);
      setShowCelebration(true);

      localStorage.removeItem(`validation_${challenge.id}`);
      localStorage.removeItem(`challenge_answer_${challenge.id}`);
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Submission failed', {
        description: 'Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextChallenge = () => {
    if (submissionResult?.nextChallenge) {
      router.push(`/dashboard/challenges/${submissionResult.nextChallenge.slug}`);
    } else {
      router.push('/dashboard/challenges/product-planning');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-slate-600">
            <Link href={`/dashboard/challenges/${challenge.slug}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Lightbulb className="h-3 w-3 mr-1" />
              Product Planning
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Users className="h-3 w-3 mr-1" />
              Team Collaboration
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{challenge.title}</h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column: PM Message & Team Discussion */}
          <div className="lg:col-span-1 space-y-4">
            {/* PM Message Card */}
            {pmMessage && (
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-700">
                    <MessageSquare className="h-4 w-4" />
                    PM Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 italic">&ldquo;{pmMessage.replace(/^"|"$/g, '')}&rdquo;</p>
                </CardContent>
              </Card>
            )}

            {/* JIRA Summary Card */}
            {jiraSummary && (
              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-orange-700">
                    <CheckSquare className="h-4 w-4" />
                    JIRA Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700">{jiraSummary}</p>
                </CardContent>
              </Card>
            )}

            {/* Team Discussion Card */}
            {teamDiscussion && (
              <Card className="border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-purple-700">
                    <Users className="h-4 w-4" />
                    Team Discussion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-700">
                    <ChallengeMarkdownRenderer content={teamDiscussion} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Objectives */}
            {challenge.learning_objectives && challenge.learning_objectives.length > 0 && (
              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-green-700">
                    <Target className="h-4 w-4" />
                    Learning Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {challenge.learning_objectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Your Task & Answer Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Your Task Card */}
            {yourTask && (
              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Your Task
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-700">
                    <ChallengeMarkdownRenderer content={yourTask} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Answer Editor Card */}
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-900">
                  Your Feature Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={starterPlaceholder}
                  className="min-h-[400px] font-mono text-sm resize-none"
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <div className={`h-1.5 w-1.5 rounded-full ${isSaving ? 'bg-orange-400' : 'bg-green-500'}`}></div>
                    <span>{isSaving ? 'Saving...' : 'Saved'}</span>
                  </div>
                  {isClient && (
                    <div className="text-xs text-slate-500">
                      {answer.trim().length} characters
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={handleValidate}
                disabled={isValidating}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-md w-full"
                size="lg"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Validate Plan
                  </>
                )}
              </Button>

              {validationResult?.passed && !hasSubmitted && (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-md w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Challenge
                    </>
                  )}
                </Button>
              )}

              {hasSubmitted && (
                <Button
                  variant="outline"
                  disabled
                  className="text-green-600 border-green-600 w-full"
                  size="lg"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Submitted
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Mentor Dock */}
      <AIMentorDock
        challengeId={challenge.id}
        challengeTitle={challenge.title}
        challengeDescription={challenge.description}
        currentCode={answer}
        difficulty={challenge.difficulty}
      />

      {/* Validation Results Modal */}
      <ValidationResultsModal
        open={showValidationModal}
        onOpenChange={setShowValidationModal}
        result={validationResult}
        onSubmit={validationResult?.passed ? handleSubmit : undefined}
        onTryAgain={() => setShowValidationModal(false)}
        isSubmitting={isSubmitting}
      />

      {/* Celebration */}
      <BugResolvedCelebration
        show={showCelebration && validationResult?.passed}
        score={validationResult?.score || 0}
        pointsEarned={submissionResult?.pointsEarned || challenge.points}
        maxPoints={challenge.points}
        isFirstPass={submissionResult?.isFirstPass}
        onNext={handleNextChallenge}
        tierUnlocked={submissionResult?.tierUnlocked}
        nextChallengeTitle={submissionResult?.nextChallenge?.title}
      />
    </div>
  );
}
