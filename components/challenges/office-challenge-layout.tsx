'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FlexibleEditor } from './flexible-editor';
import { ValidationResultsModal } from './validation-results-modal';
import { BugResolvedCelebration } from './bug-resolved-celebration';
import {
  Loader2,
  BookOpen,
  Target,
  Award,
  ArrowLeft,
  CheckCircle2,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface OfficeChallengeLayoutProps {
  challenge: any;
}

export function OfficeChallengeLayout({ challenge }: OfficeChallengeLayoutProps) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const responseFormat = challenge.response_format || 'markdown';
  const validationType = challenge.validation_type || 'ai_only';
  const isMergeConflictChallenge = responseFormat === 'merge_conflict_interactive';
  const mergeConflictScenarios = isMergeConflictChallenge && challenge.test_cases?.scenarios
    ? challenge.test_cases.scenarios
    : [];

  const getBackUrl = () => {
    const tier = challenge.tier?.toLowerCase();
    switch (tier) {
      case 'beginner':
      case 'intermediate':
        // Both beginner and intermediate tiers are shown on Practical Coding Challenges page
        return '/dashboard/challenges/practical';
      case 'software-engineering-essentials':
        return '/dashboard/challenges/software-engineering-essentials';
      case 'advanced':
        return '/dashboard/challenges/advanced';
      case 'product_planning':
      case 'product-planning':
        return '/dashboard/challenges/product-planning';
      default:
        return '/dashboard/challenges';
    }
  };

  const handleValidate = async () => {
    // Special validation for merge conflict challenges
    if (isMergeConflictChallenge) {
      try {
        const parsed = JSON.parse(code);
        if (!parsed.scenarios || parsed.scenarios.length !== mergeConflictScenarios.length) {
          toast.error('Incomplete selections!', {
            description: 'Please complete all merge conflict scenarios before submitting.'
          });
          return;
        }
      } catch (e) {
        toast.error('Invalid submission!', {
          description: 'Please complete all merge conflict scenarios before submitting.'
        });
        return;
      }
    } else {
      // Basic validation for other formats
      if (!code || code.trim().length < 50) {
        toast.error('Response too short!', {
          description: 'Please provide a more detailed response.'
        });
        return;
      }
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch('/api/ai/validate-hybrid', {
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
    } catch (error: any) {
      console.error('Error validating:', error);
      toast.error('Validation failed', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!validationResult) {
      toast.error('Please validate first!');
      return;
    }

    if (!validationResult.passed) {
      toast.error('Cannot submit failed attempt!', {
        description: 'Please improve your response and try again.'
      });
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

      if (!response.ok) throw new Error('Submission failed');

      const result = await response.json();

      // Show celebration
      setShowValidationModal(false);
      setShowCelebration(true);

      // Redirect after celebration to the tier-specific challenges list
      setTimeout(() => {
        router.push(getBackUrl());
      }, 3000);

    } catch (error: any) {
      console.error('Error submitting:', error);
      toast.error('Submission failed', {
        description: error.message || 'Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(getBackUrl())}
              className="-ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-semibold text-slate-900">
                  {challenge.title}
                </h1>
                <Badge variant="secondary" className="capitalize text-xs">
                  {challenge.difficulty}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Office Fundamentals • {challenge.points} points
              </p>
            </div>
            <Badge variant="outline" className="flex items-center gap-1.5 w-fit">
              <Award className="w-3 h-3" />
              {challenge.points} XP
            </Badge>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(getBackUrl())}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-slate-300" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-slate-900">
                    {challenge.title}
                  </h1>
                  <Badge variant="secondary" className="capitalize">
                    {challenge.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mt-0.5">
                  Office Fundamentals • {challenge.points} points
                </p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              {challenge.points} XP
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 sm:gap-8">
          {/* Left Column - Challenge Info (2 columns) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Description Card */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-semibold">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                  Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="prose prose-sm max-w-none">
                  {challenge.description.split('\n').map((line: string, index: number) => {
                    // Handle markdown headings
                    if (line.startsWith('###')) {
                      return (
                        <h4 key={index} className="text-sm sm:text-base font-semibold text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2">
                          {line.replace(/^###\s*/, '')}
                        </h4>
                      );
                    }
                    if (line.startsWith('##')) {
                      return (
                        <h3 key={index} className="text-base sm:text-lg font-bold text-gray-900 mt-3 sm:mt-4 mb-1.5 sm:mb-2">
                          {line.replace(/^##\s*/, '')}
                        </h3>
                      );
                    }
                    // Handle markdown bold
                    const boldText = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
                    // Handle bullet points
                    if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                      return (
                        <li key={index} className="text-sm sm:text-base text-gray-700 leading-relaxed ml-4 mb-1" dangerouslySetInnerHTML={{ __html: boldText.replace(/^[-*]\s*/, '') }} />
                      );
                    }
                    // Regular paragraph
                    if (line.trim()) {
                      return (
                        <p key={index} className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2 sm:mb-3" dangerouslySetInnerHTML={{ __html: boldText }} />
                      );
                    }
                    return null;
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Objectives Card */}
            {challenge.learning_objectives && challenge.learning_objectives.length > 0 && (
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-semibold">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    Learning Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <ul className="space-y-2 sm:space-y-3">
                    {challenge.learning_objectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-green-600 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Alert className="border-sky-200 bg-sky-50">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              <AlertDescription className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {isMergeConflictChallenge
                  ? 'Think carefully about each scenario. Consider what would be best for the codebase and team.'
                  : 'Take your time to provide a thoughtful, well-structured response. Use proper formatting and be clear.'}
              </AlertDescription>
            </Alert>
          </div>

          {/* Right Column - Challenge Content (3 columns) */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardContent className="p-3 sm:p-6">
                {/* Editor Area */}
                <div className="h-[400px] sm:h-[500px] lg:h-[calc(100vh-280px)] lg:min-h-[600px]">
                  <FlexibleEditor
                    responseFormat={responseFormat}
                    value={code}
                    onChange={setCode}
                    scenarios={isMergeConflictChallenge ? mergeConflictScenarios : undefined}
                    isSubmitting={isValidating || isSubmitting}
                    onMergeConflictComplete={async (responses) => {
                      const submissionData = JSON.stringify({ scenarios: responses });
                      setCode(submissionData);

                      // Auto-validate and submit
                      setIsValidating(true);
                      try {
                        const response = await fetch('/api/ai/validate-hybrid', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            challengeId: challenge.id,
                            code: submissionData,
                            language: responseFormat,
                          }),
                        });

                        if (!response.ok) throw new Error('Validation failed');

                        const result = await response.json();
                        setValidationResult(result);

                        // Auto-submit if passed
                        if (result.passed) {
                          setIsSubmitting(true);
                          const submitResponse = await fetch('/api/challenges/submit', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              challengeId: challenge.id,
                              code: submissionData,
                              language: responseFormat,
                              validationResult: result,
                            }),
                          });

                          if (!submitResponse.ok) throw new Error('Submission failed');

                          setShowCelebration(true);
                          setTimeout(() => {
                            router.push(getBackUrl());
                          }, 3000);
                        } else {
                          setShowValidationModal(true);
                        }
                      } catch (error: any) {
                        console.error('Error:', error);
                        toast.error('Failed to process', {
                          description: error.message
                        });
                      } finally {
                        setIsValidating(false);
                        setIsSubmitting(false);
                      }
                    }}
                  />
                </div>

                {/* Action Buttons - Hidden for merge conflict challenges */}
                {!isMergeConflictChallenge && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t space-y-3">
                    {validationResult && (
                      <div className="text-xs sm:text-sm text-slate-500 text-center">
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                          Validated: {validationResult.score}/100
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        onClick={handleValidate}
                        disabled={isValidating}
                        size="default"
                        variant="outline"
                        className="w-full"
                      >
                        {isValidating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Validating...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Validate Response
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!validationResult?.passed || isSubmitting}
                        size="default"
                        className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 w-full"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Award className="h-4 w-4 mr-2" />
                            Submit Challenge
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modals */}
      {validationResult && (
        <ValidationResultsModal
          open={showValidationModal}
          onOpenChange={setShowValidationModal}
          result={validationResult}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {showCelebration && (
        <BugResolvedCelebration
          show={showCelebration}
          score={validationResult?.score || 0}
          pointsEarned={challenge.points}
          maxPoints={challenge.points}
        />
      )}
    </div>
  );
}
