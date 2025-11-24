import { Metadata } from 'next';
import { Suspense } from 'react';
import { FlashcardView } from '@/components/interview-prep/flashcard-view';

export const metadata: Metadata = {
  title: 'Flashcard Mode - Interview Prep | QodeBench',
  description: 'Review MERN stack interview questions in flashcard mode',
};

export default function FlashcardModePage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading flashcards...</p>
          </div>
        </div>
      }>
        <FlashcardView />
      </Suspense>
    </div>
  );
}
