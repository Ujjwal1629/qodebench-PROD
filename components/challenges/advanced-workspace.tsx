'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { FlexibleEditor } from './flexible-editor';
import { ChallengeHeader } from './challenge-header';
import { ChallengeDetailsPanel } from './challenge-details-panel';
import { ValidationResultsModal } from './validation-results-modal';
import { BugResolvedCelebration } from './bug-resolved-celebration';
import { AIMentorDock } from './ai-mentor-dock';
import { Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import type { AdvancedChallengeMetadata } from '@/types/challenges';

interface AdvancedWorkspaceProps {
  challenge: any;
  metadata: AdvancedChallengeMetadata;
}

export function AdvancedWorkspace({ challenge, metadata }: AdvancedWorkspaceProps) {
  const router = useRouter();
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // Scroll to top when challenge changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [challenge.id]);

  const responseFormat = challenge.response_format || 'javascript';
  const validationType = challenge.validation_type || 'test_cases';

  // Determine starter code based on response format
  const getStarterCode = useMemo(() => {
    let parsedStarterCode = challenge.starter_code;

    if (typeof challenge.starter_code === 'string') {
      try {
        parsedStarterCode = JSON.parse(challenge.starter_code);
      } catch (e) {
        console.error('Failed to parse starter_code:', e);
      }
    }

    if (parsedStarterCode?.[responseFormat]) {
      return parsedStarterCode[responseFormat];
    }

    if (responseFormat === 'markdown' && parsedStarterCode?.markdown) {
      return parsedStarterCode.markdown;
    }

    switch (responseFormat) {
      case 'markdown':
        return '## Your Response\n\nWrite your response here using markdown formatting.';
      case 'text':
        return 'Write your response here...';
      case 'typescript':
        return '// Write your TypeScript solution here\n\nfunction solution() {\n  // Your code here\n}';
      case 'json':
        return '{\n  "key": "value"\n}';
      default:
        return '// Write your solution here\n\nfunction solution() {\n  // Your code here\n}';
    }
  }, [challenge.starter_code, responseFormat]);

  const starterCode = getStarterCode;

  // State
  const [code, setCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCode = localStorage.getItem(`challenge_code_${challenge.id}`);
      if (savedCode && savedCode !== starterCode) {
        return savedCode;
      }
    }
    return starterCode;
  });

  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    setIsSaving(true);
    const saveTimer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`challenge_code_${challenge.id}`, code);
      }
      setIsSaving(false);
    }, 500);

    return () => clearTimeout(saveTimer);
  }, [code, challenge.id]);

  const handleValidate = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first!');
      return;
    }

    const normalizedCode = code.trim().replace(/\s+/g, ' ');
    const normalizedStarter = starterCode.trim().replace(/\s+/g, ' ');

    if (normalizedCode === normalizedStarter) {
      toast.error('Please modify the content before validating!');
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const useHybridValidation = validationType === 'hybrid' || validationType === 'ai_only';
      const validationEndpoint = useHybridValidation
        ? '/api/ai/validate-hybrid'
        : '/api/ai/validate';

      const response = await fetch(validationEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          code,
          language: responseFormat,
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
        code,
        score: result.score,
        timestamp: Date.now(),
      }));
    } catch (error: any) {
      console.error('Error validating code:', error);
      toast.error('Validation failed', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!validationResult) {
      toast.error('Please validate your code first!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/challenges/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          code,
          language: responseFormat,
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
      localStorage.removeItem(`challenge_code_${challenge.id}`);
    } catch (error) {
      console.error('Error submitting code:', error);
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
      router.push('/dashboard/challenges/advanced');
    }
  };

  // Create mobile info button for header
  const mobileInfoButton = (
    <button
      onClick={() => setIsMobileInfoOpen(true)}
      className="lg:hidden flex-shrink-0 bg-gradient-to-r from-purple-500 to-purple-700 text-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all"
      aria-label="View Challenge Details"
    >
      <Info className="h-5 w-5" />
    </button>
  );

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <ChallengeHeader challenge={challenge} mobileInfoButton={mobileInfoButton} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Challenge Details Panel (collapsible) */}
        <div className="hidden lg:block">
          <ChallengeDetailsPanel
            title={challenge.title}
            metadata={metadata}
            isCollapsed={isPanelCollapsed}
            onToggle={() => setIsPanelCollapsed(!isPanelCollapsed)}
          />
        </div>

        {/* Main Editor Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Editor */}
          <div className="flex-1 p-3 pb-1 lg:p-6 overflow-hidden">
            <FlexibleEditor
              responseFormat={responseFormat}
              value={code}
              onChange={setCode}
              placeholder="Write your solution here..."
              className="lg:h-full border border-gray-200 rounded-sm"
              starterCode={starterCode}
              onReset={() => setCode(starterCode)}
            />
          </div>

          {/* Action Bar */}
          <div className="sticky bottom-0 border-t border-gray-200 px-3 py-2.5 lg:px-6 lg:py-4 bg-white shadow-lg z-30">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {/* Test & Deploy Button */}
              <Button
                onClick={handleValidate}
                disabled={isValidating}
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-md transition-all hover:shadow-lg w-full sm:w-auto"
                size="default"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Testing Deployment...</span>
                    <span className="sm:hidden">Testing...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Test & Deploy</span>
                    <span className="sm:hidden">Validate</span>
                  </>
                )}
              </Button>

              {/* Submit Button */}
              {validationResult?.passed && !hasSubmitted && (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-md w-full sm:w-auto"
                  size="default"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Challenge
                    </>
                  )}
                </Button>
              )}

              {/* Submitted Status */}
              {hasSubmitted && (
                <Button
                  variant="outline"
                  disabled
                  className="text-green-600 border-green-600 w-full sm:w-auto"
                  size="default"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Submitted
                </Button>
              )}

              {/* Auto-save indicator */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 sm:ml-auto">
                <div className={`h-1.5 w-1.5 rounded-full ${isSaving ? 'bg-orange-400' : 'bg-green-500'}`}></div>
                <span>{isSaving ? 'Saving...' : 'Saved'}</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* AI Mentor Dock */}
      <AIMentorDock
        challengeId={challenge.id}
        challengeTitle={challenge.title}
        challengeDescription={challenge.description}
        currentCode={code}
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

      {/* Bug Resolved Celebration */}
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

      {/* Mobile Challenge Details Drawer */}
      <Sheet open={isMobileInfoOpen} onOpenChange={setIsMobileInfoOpen}>
        <SheetContent side="left" className="w-full sm:w-[90vw] md:w-[400px] p-0 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-500 to-purple-700">
              <SheetTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="h-5 w-5" />
                Challenge Details
              </SheetTitle>
              <p className="text-xs text-purple-100 mt-1">Requirements & objectives</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChallengeDetailsPanel
                title={challenge.title}
                metadata={metadata}
                isCollapsed={false}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
