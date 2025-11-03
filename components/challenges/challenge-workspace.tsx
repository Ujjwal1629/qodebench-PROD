'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FlexibleEditor } from './flexible-editor';
import { AILearningCompanion } from './ai-learning-companion';
import { ValidationResult } from './validation-result';
import ReactMarkdown from 'react-markdown';
import {
  CheckCircle,
  Loader2,
  Trophy,
  Clock,
  Target,
  ArrowLeft,
  Send,
  AlertCircle,
  X,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface ChallengeWorkspaceProps {
  challenge: any;
}

export function ChallengeWorkspace({ challenge }: ChallengeWorkspaceProps) {
  const router = useRouter();

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
  const [code, setCode] = useState(starterCode);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [infoBanner, setInfoBanner] = useState<{ show: boolean; message: string; title: string } | null>(null);

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };

  // Auto-dismiss info banner after 5 seconds
  useEffect(() => {
    if (infoBanner?.show) {
      const timer = setTimeout(() => {
        setInfoBanner(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [infoBanner]);

  const handleValidate = async () => {
    // Check if code is empty
    if (!code.trim()) {
      setInfoBanner({
        show: true,
        title: challengeType === 'document' ? 'Please write your response first!' : 'Please write some code first!',
        message: challengeType === 'document'
          ? 'The editor is empty. Write your response before validating.'
          : 'The code editor is empty. Write your solution before validating.'
      });
      return;
    }

    // Check if code has been modified from starter code
    const normalizedCode = code.trim().replace(/\s+/g, ' ');
    const normalizedStarter = starterCode.trim().replace(/\s+/g, ' ');

    if (normalizedCode === normalizedStarter) {
      setInfoBanner({
        show: true,
        title: 'Please modify the content before validating!',
        message: 'The current content is the same as the starter template. Make your changes and try again.'
      });
      return;
    }

    // Check minimum length
    const minLength = responseFormat === 'markdown' || responseFormat === 'text' ? 50 : 20;
    if (code.trim().length < minLength) {
      setInfoBanner({
        show: true,
        title: 'Your response seems too short!',
        message: `Please write at least ${minLength} characters before validating.`
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);
    setInfoBanner(null); // Clear any previous info banner

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

      // Save this validation to localStorage for next time
      localStorage.setItem(storageKey, JSON.stringify({
        code,
        score: result.score,
        timestamp: Date.now(),
      }));
    } catch (error: any) {
      console.error('Error validating code:', error);
      alert(error.message || 'Failed to validate. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!validationResult) {
      alert('Please validate your code first!');
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

      // Clear validation history from localStorage on successful submit
      const storageKey = `validation_${challenge.id}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error submitting code:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Info Banner */}
      {infoBanner?.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-top duration-300">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-blue-900 mb-1">
                  {infoBanner.title}
                </h3>
                <p className="text-sm text-blue-800">
                  {infoBanner.message}
                </p>
              </div>
              <button
                onClick={() => setInfoBanner(null)}
                className="text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Link href="/dashboard/challenges">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Challenges
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {challenge.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge
                className={
                  difficultyColors[
                    challenge.difficulty as keyof typeof difficultyColors
                  ]
                }
              >
                {challenge.difficulty}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Trophy className="h-3 w-3" />
                {challenge.points} points
              </Badge>
              {challenge.estimated_time && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  ~{challenge.estimated_time} min
                </Badge>
              )}
              <Badge variant="outline">{challenge.category}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Description
        </h2>
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">{children}</h3>
              ),
              h2: ({ children }) => (
                <h4 className="text-lg font-semibold text-slate-900 mt-3 mb-2">{children}</h4>
              ),
              h3: ({ children }) => (
                <h5 className="text-base font-semibold text-slate-900 mt-2 mb-1">{children}</h5>
              ),
              p: ({ children }) => (
                <p className="text-slate-700 leading-relaxed mb-3">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-outside ml-5 space-y-1.5 mb-3 text-slate-700">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside ml-5 space-y-1.5 mb-3 text-slate-700">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-slate-700 leading-relaxed">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-slate-900">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-slate-700">{children}</em>
              ),
              code: ({ children }) => (
                <code className="text-slate-800 font-mono text-sm border border-slate-200 px-1 py-0.5 rounded">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded-lg overflow-x-auto mb-3 font-mono text-sm">
                  {children}
                </pre>
              ),
            }}
          >
            {challenge.description}
          </ReactMarkdown>
        </div>

        {challenge.learning_objectives &&
          challenge.learning_objectives.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
                <Target className="h-4 w-4 text-blue-600" />
                Learning Objectives
              </h3>
              <ul className="space-y-2">
                {challenge.learning_objectives.map(
                  (objective: string, index: number) => (
                    <li
                      key={index}
                      className="flex gap-2 text-sm text-slate-700"
                    >
                      <span className="text-blue-600 font-semibold">•</span>
                      <span>{objective}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Editor */}
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Your Solution
            </h2>
            <div className="mb-3 text-xs text-slate-500 italic">
              {challengeType === 'document'
                ? '💡 Write your response below using proper formatting. Make sure to include all required sections.'
                : '💡 Write your code below. Make sure to modify the starter code before validating.'}
            </div>
            <FlexibleEditor
              responseFormat={responseFormat}
              value={code}
              onChange={setCode}
              placeholder={challengeType === 'document'
                ? 'Write your response here...'
                : 'Write your solution here...'}
            />
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleValidate}
                disabled={isValidating}
                className="flex-1 gap-2"
                size="lg"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Validate Code
                  </>
                )}
              </Button>
              {validationResult && (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || hasSubmitted}
                  variant={validationResult.passed ? 'default' : 'secondary'}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : hasSubmitted ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Submitted!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Solution
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - AI Companion & Results */}
        <div className="space-y-4">
          {/* Validation Result */}
          {validationResult && (
            <ValidationResult result={validationResult} />
          )}

          {/* AI Learning Companion */}
          <AILearningCompanion
            challengeId={challenge.id}
            challengeTitle={challenge.title}
            challengeDescription={challenge.description}
            currentCode={code}
            difficulty={challenge.difficulty}
          />
        </div>
      </div>

      {/* Submission Result Modal */}
      {hasSubmitted && submissionResult && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="rounded-xl bg-white p-8 text-center shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300">
            {validationResult.passed ? (
              <>
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
                <h3 className="mb-2 text-2xl font-bold text-slate-900">
                  Challenge Passed! 🎉
                </h3>
                <p className="text-slate-600 mb-2">
                  Earned {submissionResult.pointsEarned} points
                </p>

                {/* Tier Unlocked Message */}
                {submissionResult.tierUnlocked && (
                  <div className="my-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-purple-900 font-semibold">
                      🚀 {submissionResult.tierUnlocked} tier unlocked!
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {submissionResult.nextChallenge ? (
                    <>
                      <Button
                        asChild
                        className="w-full"
                        size="lg"
                      >
                        <Link href={`/dashboard/challenges/${submissionResult.nextChallenge.slug}`}>
                          Next Challenge →
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full"
                      >
                        <Link href="/dashboard/challenges">
                          Back to Challenges
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button
                      asChild
                      className="w-full"
                      size="lg"
                    >
                      <Link href="/dashboard/challenges">
                        Back to Challenges
                      </Link>
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <XCircle className="mx-auto mb-4 h-16 w-16 text-orange-600" />
                <h3 className="mb-2 text-2xl font-bold text-slate-900">
                  Keep Trying!
                </h3>
                <p className="text-slate-600 mb-6">
                  Your solution didn't pass this time. Review the feedback and try again!
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setHasSubmitted(false);
                      setSubmissionResult(null);
                      setValidationResult(null);
                    }}
                    className="w-full"
                    size="lg"
                  >
                    Retry Challenge
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <Link href="/dashboard/challenges">
                      Back to Challenges
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
