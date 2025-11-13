'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, AlertCircle, Lightbulb, TrendingUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImprovedFeedback {
  issue: string;
  yourCode?: string | null;
  betterApproach: string;
  explanation: string;
}

interface ValidationResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: {
    passed: boolean;
    score: number;
    scoreBreakdown?: {
      structure?: {
        score: number;
        weight: number;
        feedback: string[];
      };
      quality: {
        score: number;
        weight: number;
        feedback: any;
      };
    };
    strengths?: string[];
    improvements?: ImprovedFeedback[];
    suggestions?: string[];
    codeQuality?: string;
    pointsEarned?: number;
  } | null;
  onSubmit?: () => void;
  onTryAgain?: () => void;
  isSubmitting?: boolean;
}

export function ValidationResultsModal({
  open,
  onOpenChange,
  result,
  onSubmit,
  onTryAgain,
  isSubmitting = false,
}: ValidationResultsModalProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score counting
  useEffect(() => {
    if (open && result) {
      setAnimatedScore(0);
      const duration = 1000; // 1 second
      const steps = 50;
      const increment = result.score / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setAnimatedScore(result.score);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(increment * currentStep));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [open, result?.score]);

  if (!result) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 border-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 border-blue-600 bg-blue-50';
    return 'text-orange-600 border-orange-600 bg-orange-50';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-blue-500 to-sky-600';
    return 'from-orange-500 to-amber-600';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header with Score */}
        <DialogHeader className={`p-6 border-b bg-gradient-to-r ${getScoreGradient(result.score)}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                {result.passed ? 'Validation Passed! 🎉' : 'Needs Improvement'}
              </DialogTitle>
              <p className="text-sm text-white/90">
                {result.passed
                  ? 'Your solution meets the requirements!'
                  : 'Review the feedback below to improve your solution'}
              </p>
            </div>

            {/* Animated Score Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className={`relative ${getScoreColor(result.score)} border-4 rounded-full w-28 h-28 flex items-center justify-center shadow-2xl`}
            >
              <div className="text-center">
                <motion.div
                  key={animatedScore}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold"
                >
                  {animatedScore}
                </motion.div>
                <div className="text-xs font-semibold opacity-75">/100</div>
              </div>
            </motion.div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="h-[calc(90vh-320px)] p-6">
          <div className="space-y-6">
            {/* Score Breakdown (for hybrid validation) */}
            {result.scoreBreakdown && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">Score Breakdown</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {result.scoreBreakdown.structure && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">Structure</div>
                      <div className="text-3xl font-bold text-gray-900">
                        {result.scoreBreakdown.structure.score}
                        <span className="text-lg text-gray-400">/{result.scoreBreakdown.structure.weight}</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Quality</div>
                    <div className="text-3xl font-bold text-gray-900">
                      {result.scoreBreakdown.quality.score}
                      <span className="text-lg text-gray-400">/{result.scoreBreakdown.quality.weight}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Code Quality Summary */}
            {result.codeQuality && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-200"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-sky-500 p-2 rounded-lg flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Overall Assessment</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.codeQuality}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Strengths */}
            {result.strengths && result.strengths.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Strengths</h3>
                </div>
                <div className="space-y-2">
                  {result.strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-3"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Improvements */}
            {result.improvements && result.improvements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-bold text-gray-900">Senior Developer Review</h3>
                </div>
                <div className="space-y-4">
                  {result.improvements.map((improvement, index) => (
                    <div
                      key={index}
                      className="bg-white border-2 border-red-200 rounded-xl p-5 space-y-4"
                    >
                      {/* Issue Header with Number */}
                      <div className="flex items-start gap-3">
                        <div className="bg-red-100 text-red-700 font-bold text-sm px-2.5 py-1 rounded flex-shrink-0">
                          Issue #{index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-base leading-relaxed">
                            {improvement.issue || 'Issue description not provided by reviewer'}
                          </h4>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-xs font-semibold text-blue-800 mb-2 uppercase tracking-wide">
                          Why This Matters:
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {improvement.explanation || 'The reviewer did not provide a detailed explanation. Please review your implementation carefully.'}
                        </p>
                      </div>

                      {/* Your Code (if provided) */}
                      {improvement.yourCode && improvement.yourCode.trim() !== '' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="text-xs font-semibold text-red-800 mb-2 uppercase tracking-wide">
                            ❌ Your Code:
                          </div>
                          <pre className="text-sm text-gray-800 overflow-x-auto bg-white p-3 rounded border border-red-100 font-mono">
                            <code>{improvement.yourCode}</code>
                          </pre>
                        </div>
                      )}

                      {/* Better Approach */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-xs font-semibold text-green-800 mb-2 uppercase tracking-wide">
                          ✅ Better Approach:
                        </div>
                        <pre className="text-sm text-gray-800 overflow-x-auto bg-white p-3 rounded border border-green-100 font-mono whitespace-pre-wrap break-words">
                          <code>{improvement.betterApproach || 'Reviewer did not provide a specific example. Consider researching best practices for this pattern.'}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty state for passed with no improvements */}
            {(!result.improvements || result.improvements.length === 0) && result.passed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center"
              >
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Excellent Work!</h3>
                <p className="text-sm text-gray-600">
                  No major improvements needed. Your solution meets professional standards.
                </p>
              </motion.div>
            )}

            {/* Suggestions */}
            {result.suggestions && result.suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-bold text-gray-900">Suggestions</h3>
                </div>
                <div className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3"
                    >
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Footer with Actions */}
        <DialogFooter className="p-6 border-t bg-gray-50 flex-row justify-between items-center">
          <Button
            variant="outline"
            onClick={onTryAgain}
            className="border-2"
          >
            Try Again
          </Button>

          {result.passed && onSubmit && (
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-md"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Submit Challenge
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
