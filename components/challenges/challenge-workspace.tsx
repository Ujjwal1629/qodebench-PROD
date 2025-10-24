'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodeEditor } from './code-editor';
import { AILearningCompanion } from './ai-learning-companion';
import { ValidationResult } from './validation-result';
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
} from 'lucide-react';
import Link from 'next/link';

interface ChallengeWorkspaceProps {
  challenge: any;
}

export function ChallengeWorkspace({ challenge }: ChallengeWorkspaceProps) {
  const router = useRouter();
  const starterCode = challenge.starter_code?.javascript || '// Write your solution here';
  const [code, setCode] = useState(starterCode);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
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
        title: 'Please write some code first!',
        message: 'The code editor is empty. Write your solution before validating.'
      });
      return;
    }

    // Check if code has been modified from starter code
    const normalizedCode = code.trim().replace(/\s+/g, ' ');
    const normalizedStarter = starterCode.trim().replace(/\s+/g, ' ');

    if (normalizedCode === normalizedStarter) {
      setInfoBanner({
        show: true,
        title: 'Please modify the code before validating!',
        message: 'The current code is the same as the starter code. Make your changes and try again.'
      });
      return;
    }

    // Check if code is too short (less than 20 characters excluding comments/whitespace)
    const codeWithoutComments = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (codeWithoutComments.length < 20) {
      setInfoBanner({
        show: true,
        title: 'Your solution seems incomplete!',
        message: 'Please write a more complete solution before validating.'
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);
    setInfoBanner(null); // Clear any previous info banner

    try {
      const response = await fetch('/api/ai/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          code,
          language: 'javascript',
        }),
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const result = await response.json();
      setValidationResult(result);
    } catch (error) {
      console.error('Error validating code:', error);
      alert('Failed to validate code. Please try again.');
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
          language: 'javascript',
          validationResult,
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      await response.json();
      setHasSubmitted(true);

      // Show success message
      setTimeout(() => {
        router.push('/dashboard/challenges');
      }, 2000);
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
          <p className="leading-relaxed text-slate-700 whitespace-pre-line">
            {challenge.description}
          </p>
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
              💡 Write your code below. Make sure to modify the starter code before validating.
            </div>
            <CodeEditor
              starterCode={starterCode}
              language="javascript"
              onCodeChange={setCode}
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

      {/* Success Message */}
      {hasSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white p-8 text-center shadow-xl">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
            <h3 className="mb-2 text-2xl font-bold text-slate-900">
              Submission Complete!
            </h3>
            <p className="text-slate-600">Redirecting to challenges...</p>
          </div>
        </div>
      )}
    </div>
  );
}
