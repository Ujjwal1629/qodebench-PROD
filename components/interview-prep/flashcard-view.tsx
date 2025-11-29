'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, RotateCw, Home } from 'lucide-react';
import Link from 'next/link';
import { INTERVIEW_TOPICS, INTERVIEW_DIFFICULTY } from '@/types/interview-prep';
import type { InterviewPrepQuestion } from '@/types/interview-prep';

export function FlashcardView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const topic = searchParams?.get('topic') || '';
  const level = searchParams?.get('level') || 'fresher';

  const [questions, setQuestions] = useState<InterviewPrepQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch questions
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `/api/interview-prep/questions?topic=${topic}&level=${level}&mode=flashcard`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load flashcards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (topic && level) {
      fetchQuestions();
    }
  }, [topic, level]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      handleFlip();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, questions.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-6">
        <Card className="p-6 sm:p-12 text-center">
          <p className="text-slate-600 mb-4">{error || 'No questions found for this topic.'}</p>
          <Button onClick={() => router.push('/dashboard/interview-prep')} variant="outline" className="w-full sm:w-auto">
            <Home className="h-4 w-4 mr-2" />
            Back to Interview Prep
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const topicInfo = INTERVIEW_TOPICS[topic as keyof typeof INTERVIEW_TOPICS];
  const difficultyStyle = INTERVIEW_DIFFICULTY[currentQuestion.difficulty];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
          <Link
            href="/dashboard/interview-prep"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Prep
          </Link>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <span>{topicInfo?.title}</span>
            <span className="text-slate-300">•</span>
            <span>{level === 'fresher' ? 'Fresher' : 'Experienced'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Flashcard Mode</h1>
          <p className="text-sm sm:text-base text-slate-600">
            {topicInfo?.title} - {level === 'fresher' ? 'Fresher' : 'Experienced'} Level
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/interview-prep')} variant="outline" size="sm" className="w-full sm:w-auto">
          <Home className="h-4 w-4 mr-2" />
          Exit
        </Button>
      </div>

      {/* Progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-slate-600">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={`${difficultyStyle.color} ${difficultyStyle.textColor} border text-xs`}>
            {currentQuestion.difficulty}
          </Badge>
          <span className="text-xs text-slate-500">
            Press Space to flip
          </span>
        </div>
      </div>

      {/* Flashcard */}
      <div style={{ perspective: '1000px' }}>
        <div
          className="cursor-pointer transition-all duration-500 relative min-h-[400px] sm:min-h-[500px]"
          onClick={handleFlip}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front - Question */}
          <Card
            className="absolute inset-0 min-h-[400px] sm:min-h-[500px]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <CardContent className="p-4 sm:p-8 flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px]">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="text-xs sm:text-sm font-medium text-brand-600 uppercase tracking-wide">
                  Question
                </div>
                <p className="text-lg sm:text-2xl font-semibold text-slate-900 leading-relaxed px-2">
                  {currentQuestion.question_text}
                </p>
                <div className="flex items-center justify-center gap-2 text-slate-500">
                  <RotateCw className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Click or press Space to reveal answer</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back - Key Points */}
          <Card
            className="absolute inset-0 min-h-[400px] sm:min-h-[500px]"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <CardContent className="p-4 sm:p-8 flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px]">
              <div className="w-full max-w-3xl space-y-4 sm:space-y-6">
                <div className="text-xs sm:text-sm font-medium text-green-600 uppercase tracking-wide text-center">
                  Key Points
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {currentQuestion.key_points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 sm:gap-3">
                      <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs sm:text-sm font-medium">
                        {idx + 1}
                      </span>
                      <span className="text-sm sm:text-base text-slate-700 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-2 sm:gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          className="flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          onClick={handleFlip}
          variant="secondary"
          className="flex items-center justify-center gap-2 w-full sm:w-auto order-2 sm:order-2"
        >
          <RotateCw className="h-4 w-4" />
          Flip Card
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 w-full sm:w-auto order-3 sm:order-3"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Keyboard Shortcuts */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs">Space</kbd>
              <span>Flip card</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs">←</kbd>
              <span>Previous</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs">→</kbd>
              <span>Next</span>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
