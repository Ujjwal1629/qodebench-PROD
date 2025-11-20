'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Trophy, Sparkles } from 'lucide-react';

interface BugResolvedCelebrationProps {
  show: boolean;
  score: number;
  pointsEarned: number;
  maxPoints?: number;
  isFirstPass?: boolean;
  onNext?: () => void;
  tierUnlocked?: any;
  nextChallengeTitle?: string;
}

export function BugResolvedCelebration({
  show,
  score,
  pointsEarned,
  maxPoints = 50,
  isFirstPass = true,
  onNext,
  tierUnlocked,
  nextChallengeTitle,
}: BugResolvedCelebrationProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const confettiRef = useRef<any>(null);

  // Trigger confetti on mount
  useEffect(() => {
    if (show && typeof window !== 'undefined') {
      // Dynamically import canvas-confetti
      import('canvas-confetti').then((module) => {
        const confetti = module.default;
        confettiRef.current = confetti;

        // Confetti burst
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min;
        }

        const interval: NodeJS.Timeout = setInterval(function () {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            clearInterval(interval);
            return;
          }

          const particleCount = 50 * (timeLeft / duration);

          // Confetti from two sides
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
          });
        }, 250);

        return () => clearInterval(interval);
      });
    }
  }, [show]);

  // Animate score counting
  useEffect(() => {
    if (show) {
      setAnimatedScore(0);
      setAnimatedPoints(0);

      // Score animation (now uses pointsEarned for both, just delayed)
      const scoreDuration = 1500;
      const scoreSteps = 50;
      const scoreIncrement = pointsEarned / scoreSteps;
      const scoreStepDuration = scoreDuration / scoreSteps;

      let currentScoreStep = 0;
      const scoreTimer = setInterval(() => {
        currentScoreStep++;
        if (currentScoreStep >= scoreSteps) {
          setAnimatedScore(pointsEarned);
          clearInterval(scoreTimer);
        } else {
          setAnimatedScore(Math.floor(scoreIncrement * currentScoreStep));
        }
      }, scoreStepDuration);

      // Points animation (same value, just for the second box)
      setTimeout(() => {
        const pointsDuration = 1000;
        const pointsSteps = 30;
        const pointsIncrement = pointsEarned / pointsSteps;
        const pointsStepDuration = pointsDuration / pointsSteps;

        let currentPointsStep = 0;
        const pointsTimer = setInterval(() => {
          currentPointsStep++;
          if (currentPointsStep >= pointsSteps) {
            setAnimatedPoints(pointsEarned);
            clearInterval(pointsTimer);
          } else {
            setAnimatedPoints(Math.floor(pointsIncrement * currentPointsStep));
          }
        }, pointsStepDuration);
      }, 800);

      return () => {
        clearInterval(scoreTimer);
      };
    }
  }, [show, pointsEarned]);

  // Auto-dismiss countdown
  useEffect(() => {
    if (show) {
      setCountdown(10);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [show]);

  // Handle navigation when countdown reaches 0 (separate effect to avoid setState during render)
  useEffect(() => {
    if (show && countdown === 0 && onNext) {
      onNext();
    }
  }, [show, countdown, onNext]);

  // Handle ESC key
  useEffect(() => {
    if (show) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && onNext) {
          onNext();
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [show, onNext]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onNext}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 p-12 text-center overflow-hidden">
              {/* Animated background patterns */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000"></div>
              </div>

              {/* Checkmark Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="relative mx-auto w-24 h-24 mb-6"
              >
                <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"></div>
                <div className="relative bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-2xl">
                  <CheckCircle2 className="h-14 w-14 text-green-600" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg"
              >
                Bug Resolved! 🎉
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-white/90 drop-shadow"
              >
                Challenge completed successfully
              </motion.p>
            </div>

            {/* Stats Section */}
            <div className="p-8 space-y-6">
              {/* Score and Points */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 border-2 border-blue-200 text-center"
                >
                  <div className="text-sm font-semibold text-blue-800 mb-2">Final Score</div>
                  <div className="text-4xl font-bold text-blue-900">{animatedScore}/{maxPoints}</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border-2 border-amber-200 text-center"
                >
                  <div className="text-sm font-semibold text-amber-800 mb-2">Points Earned</div>
                  <div className="text-4xl font-bold text-amber-900">+{animatedPoints}</div>
                </motion.div>
              </div>

              {/* Already Passed Notice */}
              {!isFirstPass && pointsEarned === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 border-2 border-blue-200"
                >
                  <div className="flex items-center justify-center gap-2 text-blue-800">
                    <Trophy className="h-5 w-5" />
                    <span className="text-sm font-semibold">
                      You've already passed this challenge! Points awarded on first pass only.
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Tier Unlocked */}
              {tierUnlocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-white font-bold">
                    <Trophy className="h-6 w-6" />
                    <span className="text-lg">New Tier Unlocked: {tierUnlocked.tier}</span>
                    <Sparkles className="h-6 w-6" />
                  </div>
                </motion.div>
              )}

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {onNext && (
                  <Button
                    onClick={onNext}
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg text-base font-semibold"
                  >
                    {nextChallengeTitle ? (
                      <>
                        Next: {nextChallengeTitle}
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    ) : (
                      <>
                        Continue Learning
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </motion.div>

              {/* Auto-dismiss countdown */}
              {onNext && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center text-sm text-gray-500"
                >
                  Auto-continuing in {countdown}s • Press{' '}
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                    ESC
                  </kbd>{' '}
                  to continue now
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
