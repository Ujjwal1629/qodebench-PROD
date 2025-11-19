import { Metadata } from 'next';
import { Suspense } from 'react';
import { InterviewPrepHub } from '@/components/interview-prep/interview-prep-hub';

export const metadata: Metadata = {
  title: 'Interview Prep - MERN Stack Questions | QodeBench',
  description: 'Practice MERN stack interview questions for free. Flashcard mode and practice mode with AI feedback.',
};

export default function InterviewPrepPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading interview questions...</p>
          </div>
        </div>
      }>
        <InterviewPrepHub />
      </Suspense>
    </div>
  );
}
