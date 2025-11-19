'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, RotateCw, Home } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-12 text-center">
          <p className="text-slate-600 mb-4">{error || 'No questions found for this topic.'}</p>
          <Button onClick={() => router.push('/dashboard/interview-prep')} variant="outline">
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Flashcard Mode</h1>
          <p className="text-slate-600">
            {topicInfo?.title} - {level === 'fresher' ? 'Fresher' : 'Experienced'} Level
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/interview-prep')} variant="outline" size="sm">
          <Home className="h-4 w-4 mr-2" />
          Exit
        </Button>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex items-center gap-2">
          <Badge className={`${difficultyStyle.color} ${difficultyStyle.textColor} border`}>
            {currentQuestion.difficulty}
          </Badge>
          <span className="text-xs text-slate-500">
            Press Space to flip
          </span>
        </div>
      </div>

      {/* Flashcard */}
      <div className="perspective-1000">
        <Card
          className={`min-h-[400px] cursor-pointer transition-all duration-500 transform preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            {!isFlipped ? (
              // Front - Question
              <div className="text-center space-y-6" style={{ backfaceVisibility: 'hidden' }}>
                <div className="text-sm font-medium text-brand-600 uppercase tracking-wide">
                  Question
                </div>
                <p className="text-2xl font-semibold text-slate-900 leading-relaxed">
                  {currentQuestion.question_text}
                </p>
                <div className="flex items-center justify-center gap-2 text-slate-500">
                  <RotateCw className="h-4 w-4" />
                  <span className="text-sm">Click or press Space to reveal answer</span>
                </div>
              </div>
            ) : (
              // Back - Key Points
              <div
                className="w-full space-y-6"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="text-sm font-medium text-green-600 uppercase tracking-wide text-center">
                  Key Points
                </div>
                <ul className="space-y-3">
                  {currentQuestion.key_points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-medium">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          onClick={handleFlip}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <RotateCw className="h-4 w-4" />
          Flip Card
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Keyboard Shortcuts */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
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
  );
}
