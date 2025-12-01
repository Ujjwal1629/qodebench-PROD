import { Suspense } from 'react';
import { OnboardingQuiz } from '@/components/onboarding/onboarding-quiz';

export const metadata = {
  title: 'Skill Assessment Quiz - QodeBench',
  description: 'Take our quick quiz to personalize your learning experience',
};

export default function OnboardingQuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OnboardingQuiz />
    </Suspense>
  );
}
