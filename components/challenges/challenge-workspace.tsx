'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { FlexibleEditor } from './flexible-editor';
import { ChallengeHeader } from './challenge-header';
import { ChallengeSidebar } from './challenge-sidebar';
import { ValidationResultsModal } from './validation-results-modal';
import { BugResolvedCelebration } from './bug-resolved-celebration';
import { AIMentorDock } from './ai-mentor-dock';
import { Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';

interface ChallengeWorkspaceProps {
  challenge: any;
}

export function ChallengeWorkspace({ challenge }: ChallengeWorkspaceProps) {
  const router = useRouter();

  // Scroll to top when challenge changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [challenge.id]);

  // Get response format and challenge type with intelligent fallback
  const isOfficeChallenge = challenge.category === 'office' || challenge.category === 'office-fundamentals';

  // Detect document challenges by title/slug patterns
  const documentKeywords = ['description', 'rca', 'root cause', 'meeting', 'notes', 'communication', 'incident', 'documentation', 'email', 'stakeholder'];
  const isLikelyDocument = documentKeywords.some(keyword =>
    challenge.title?.toLowerCase().includes(keyword) ||
    challenge.slug?.toLowerCase().includes(keyword)
  );

  const responseFormat = challenge.response_format ||
    (isOfficeChallenge && isLikelyDocument ? 'markdown' : 'javascript');
  const challengeType = challenge.challenge_type ||
    (isOfficeChallenge && isLikelyDocument ? 'document' : 'code');
  const validationType = challenge.validation_type || 'ai_only';

  // Determine starter code based on response format
  const getStarterCode = () => {
    if (challenge.starter_code?.[responseFormat]) {
      return challenge.starter_code[responseFormat];
    }

    // Check for markdown starter in old format
    if (responseFormat === 'markdown' && challenge.starter_code?.markdown) {
      return challenge.starter_code.markdown;
    }

    // Default starter code based on response format
    switch (responseFormat) {
      case 'markdown':
        // Smart defaults based on challenge type
        if (challenge.slug?.includes('pr-description') || challenge.title?.toLowerCase().includes('pr description')) {
          return '## Summary\n\nBriefly describe what this PR does and why.\n\n## Changes Made\n\n- Change 1\n- Change 2\n\n## Testing\n\nHow was this tested?\n\n## Related Issues\n\nFixes #';
        }
        if (challenge.slug?.includes('rca') || challenge.title?.toLowerCase().includes('root cause')) {
          return '## Incident Summary\n\n**Date:** \n**Duration:** \n**Impact:** \n\n## Timeline\n\n- Time: Event description\n\n## Root Cause\n\n### Analysis\n\n## Action Items\n\n- [ ] Action 1\n- [ ] Action 2';
        }
        return '## Your Response\n\nWrite your response here using markdown formatting.\n\n### Section 1\n\n- Point 1\n- Point 2\n\n### Section 2\n\nMore details...';
      case 'text':
        return 'Write your response here...';
      case 'typescript':
        return '// Write your TypeScript solution here\n\nfunction solution() {\n  // Your code here\n}';
      case 'json':
        return '{\n  "key": "value"\n}';
      default:
        return '// Write your solution here\n\nfunction solution() {\n  // Your code here\n}';
    }
  };

  const starterCode = getStarterCode();

  // Load saved code from localStorage or use starter code
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
  const [showAI, setShowAI] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);

  // Extract requirements from description if needed
  const extractRequirements = (): string[] => {
    const lines = challenge.description.split('\n');
    const requirements: string[] = [];

    lines.forEach((line: string) => {
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        requirements.push(line.trim().substring(2));
      }
    });

    return requirements;
  };

  const requirements = extractRequirements();

  // Track code changes and auto-save to localStorage
  useEffect(() => {
    setIsModified(code !== starterCode);
    setIsSaving(true);

    // Auto-save to localStorage with debounce
    const saveTimer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`challenge_code_${challenge.id}`, code);
      }
      setIsSaving(false);
    }, 500); // Save 500ms after user stops typing

    return () => clearTimeout(saveTimer);
  }, [code, starterCode, challenge.id]);

  const handleValidate = async () => {
    // Check if code is empty
    if (!code.trim()) {
      toast.error(
        challengeType === 'document' ? 'Please write your response first!' : 'Please write some code first!',
        {
          description: challengeType === 'document'
            ? 'The editor is empty. Write your response before validating.'
            : 'The code editor is empty. Write your solution before validating.'
        }
      );
      return;
    }

    // Check if code has been modified from starter code
    const normalizedCode = code.trim().replace(/\s+/g, ' ');
    const normalizedStarter = starterCode.trim().replace(/\s+/g, ' ');

    if (normalizedCode === normalizedStarter) {
      toast.error('Please modify the content before validating!', {
        description: 'The current content is the same as the starter template. Make your changes and try again.'
      });
      return;
    }

    // STRICT validation based on response format
    const isCodeFormat = responseFormat === 'javascript' || responseFormat === 'typescript' || responseFormat === 'json';
    const isDocFormat = responseFormat === 'markdown' || responseFormat === 'text';

    // Get non-empty lines (excluding pure whitespace and comment-only lines)
    const lines = code.split('\n');
    const meaningfulLines = lines.filter((line: string) => {
      const trimmed = line.trim();
      // Skip empty lines
      if (!trimmed) return false;
      // Skip comment-only lines for code
      if (isCodeFormat && (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*'))) {
        return false;
      }
      return true;
    });

    // Check minimum length (STRICT)
    const minLength = isDocFormat ? 200 : 50;
    if (code.trim().length < minLength) {
      toast.error('Your response is too short!', {
        description: isDocFormat
          ? `Please write at least ${minLength} characters. Your ${challengeType === 'document' ? 'response' : 'solution'} needs more detail.`
          : `Please write at least ${minLength} characters of meaningful code.`
      });
      return;
    }

    // Check minimum line count (STRICT)
    const minLines = isDocFormat ? 3 : 5;
    if (meaningfulLines.length < minLines) {
      toast.error(`Not enough content!`, {
        description: isCodeFormat
          ? `Your code has only ${meaningfulLines.length} meaningful line${meaningfulLines.length !== 1 ? 's' : ''}. Please write at least ${minLines} lines of actual code (excluding comments).`
          : `Your response needs at least ${minLines} non-empty lines. Currently: ${meaningfulLines.length} line${meaningfulLines.length !== 1 ? 's' : ''}.`
      });
      return;
    }

    // Check for single-line code submissions (common for lazy attempts)
    if (isCodeFormat && meaningfulLines.length === 1) {
      toast.error('Single-line solution detected!', {
        description: 'Real solutions require multiple lines. Please write a complete implementation.'
      });
      return;
    }

    // Check for placeholder text or gibberish
    const lowerCode = code.toLowerCase();
    const placeholderPatterns = [
      'lorem ipsum',
      'placeholder',
      'your code here',
      'todo:',
      'fixme:',
      'write your',
      'asdfasdf',
      'test test',
      'hello world' // Only if it's the entire content
    ];

    const hasPlaceholder = placeholderPatterns.some(pattern => {
      if (pattern === 'hello world') {
        // Only flag if it's basically the entire content
        return lowerCode.includes(pattern) && code.trim().length < 50;
      }
      return lowerCode.includes(pattern);
    });

    if (hasPlaceholder) {
      toast.error('Placeholder content detected!', {
        description: 'Please replace placeholder text with your actual solution before validating.'
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      // Determine which validation endpoint to use
      // Use hybrid validation for all Office Fundamentals challenges
      const useHybridValidation = isOfficeChallenge;

      const validationEndpoint = useHybridValidation
        ? '/api/ai/validate-hybrid'
        : '/api/ai/validate';

      // Get previous validation attempt from localStorage (for non-hybrid only)
      const storageKey = `validation_${challenge.id}`;
      let previousAttempt = null;

      if (!useHybridValidation) {
        const previousAttemptData = localStorage.getItem(storageKey);
        if (previousAttemptData) {
          try {
            previousAttempt = JSON.parse(previousAttemptData);
          } catch (e) {
            localStorage.removeItem(storageKey);
          }
        }
      }

      const response = await fetch(validationEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          code,
          language: responseFormat,
          ...(previousAttempt && { previousAttempt }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Validation failed');
      }

      const result = await response.json();
      setValidationResult(result);
      setShowValidationModal(true); // Show modal instead of inline

      // Save this validation to localStorage for next time
      localStorage.setItem(storageKey, JSON.stringify({
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
      setShowValidationModal(false); // Close validation modal
      setShowCelebration(true); // Show celebration!

      // Clear validation history and saved code from localStorage on successful submit
      const validationKey = `validation_${challenge.id}`;
      const codeKey = `challenge_code_${challenge.id}`;
      localStorage.removeItem(validationKey);
      localStorage.removeItem(codeKey);
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
      router.push('/dashboard/challenges');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Clean Header */}
      <ChallengeHeader challenge={challenge} />

      {/* Main Layout: Sidebar + Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - 25% */}
        <div className="hidden lg:block w-[25%] min-w-[280px]">
          <ChallengeSidebar
            description={challenge.description}
            requirements={requirements.length > 0 ? requirements : undefined}
            objectives={challenge.learning_objectives}
          />
        </div>

        {/* Main Editor Area - 75% */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Editor */}
          <div className="flex-1 p-6 overflow-hidden">
            <FlexibleEditor
              responseFormat={responseFormat}
              value={code}
              onChange={setCode}
              placeholder={challengeType === 'document'
                ? 'Write your response here...'
                : 'Write your solution here...'}
              className="h-full border border-gray-200 rounded-sm"
            />
          </div>

          {/* Action Bar - Fixed at bottom with proper z-index */}
          <div className="sticky bottom-0 border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-white shadow-lg z-30">
            <div className="flex items-center gap-3">
              {/* Prominent Test & Deploy Button */}
              <Button
                onClick={handleValidate}
                disabled={isValidating}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md transition-all hover:shadow-lg px-6 py-2.5"
                size="lg"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Testing Deployment...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Test & Deploy
                  </>
                )}
              </Button>

              {/* Auto-save indicator (subtle) */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className={`h-1.5 w-1.5 rounded-full ${isSaving ? 'bg-orange-400' : 'bg-green-500'}`}></div>
                <span>{isSaving ? 'Saving...' : 'Saved'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {validationResult?.passed && !hasSubmitted && (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-md"
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
                  className="text-green-600 border-green-600"
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
        </main>
      </div>

      {/* AI Mentor Floating Dock - Always visible on right side */}
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
        onNext={handleNextChallenge}
        tierUnlocked={submissionResult?.tierUnlocked}
        nextChallengeTitle={submissionResult?.nextChallenge?.title}
      />

      {/* Mobile Info Button - Floating top-left */}
      <button
        onClick={() => setIsMobileInfoOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-40 bg-gradient-to-r from-sky-500 to-blue-600 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
        aria-label="View Challenge Info"
      >
        <Info className="h-5 w-5" />
      </button>

      {/* Mobile Challenge Info Drawer */}
      <Sheet open={isMobileInfoOpen} onOpenChange={setIsMobileInfoOpen}>
        <SheetContent side="left" className="w-full sm:w-[90vw] md:w-[400px] p-0 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-sky-500 to-blue-600">
              <SheetTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="h-5 w-5" />
                Challenge Info
              </SheetTitle>
              <p className="text-xs text-sky-50 mt-1">Requirements & objectives for this challenge</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChallengeSidebar
                description={challenge.description}
                requirements={requirements.length > 0 ? requirements : undefined}
                objectives={challenge.learning_objectives}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
