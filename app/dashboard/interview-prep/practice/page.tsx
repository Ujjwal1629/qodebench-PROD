import { Metadata } from 'next';
import { Suspense } from 'react';
import { PracticeSession } from '@/components/interview-prep/practice-session';

export const metadata: Metadata = {
  title: 'Practice Mode - Interview Prep | QodeBench',
  description: 'Practice MERN stack interview questions with AI feedback',
};

export default function PracticeModePage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading practice session...</p>
          </div>
        </div>
      }>
        <PracticeSession />
      </Suspense>
    </div>
  );
}
