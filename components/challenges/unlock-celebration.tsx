'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Trophy, Zap } from 'lucide-react';
import { ChallengeTier, TIERS } from '@/lib/constants/dashboard';
import confetti from 'canvas-confetti';

interface UnlockCelebrationProps {
  tierUnlocked: ChallengeTier;
  isOpen: boolean;
  onClose: () => void;
}

export function UnlockCelebration({
  tierUnlocked,
  isOpen,
  onClose,
}: UnlockCelebrationProps) {
  const [showFireworks, setShowFireworks] = useState(false);
  const tierInfo = TIERS[tierUnlocked];

  useEffect(() => {
    if (isOpen) {
      setShowFireworks(true);

      // Trigger confetti
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
          setShowFireworks(false);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        // Confetti from two sides
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="relative max-w-md w-full bg-gradient-to-br from-white via-white to-purple-50 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Content */}
            <div className="relative p-8 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto w-20 h-20 mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Trophy className="h-10 w-10 text-white" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-slate-900 mb-2"
              >
                Tier Unlocked!
              </motion.h2>

              {/* Tier Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg mb-4 shadow-lg"
              >
                <span className="text-2xl">{tierInfo.icon}</span>
                <span>{tierInfo.name}</span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-600 mb-6 leading-relaxed"
              >
                {tierInfo.description}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-4 mb-6"
              >
                <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-yellow-600" />
                    <span className="text-xs text-slate-600 font-medium">New Challenges</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{tierInfo.totalChallenges}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="text-xs text-slate-600 font-medium">Difficulty</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 capitalize">{tierUnlocked}</p>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button onClick={onClose} size="lg" className="w-full shadow-lg">
                  Start Challenges
                </Button>
              </motion.div>

              {/* Floating Particles */}
              {showFireworks && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        x: [0, Math.random() * 200 - 100],
                        y: [0, Math.random() * -200 - 50],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                    />
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Add to your global CSS for blob animation
/*
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
*/
