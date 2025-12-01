'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Eye, Send, Home, Clock } from 'lucide-react';
import Link from 'next/link';
import { INTERVIEW_TOPICS, INTERVIEW_DIFFICULTY } from '@/types/interview-prep';
import type { InterviewPrepQuestion, SubmitAnswerResponse } from '@/types/interview-prep';

export function PracticeSession() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const topic = searchParams?.get('topic') || '';
  const level = searchParams?.get('level') || 'fresher';

  const [questions, setQuestions] = useState<InterviewPrepQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [feedback, setFeedback] = useState<SubmitAnswerResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [showFollowUpInput, setShowFollowUpInput] = useState(false);
  const [followUpSubmitted, setFollowUpSubmitted] = useState(false);
  const [followUpFeedback, setFollowUpFeedback] = useState<string>('');
  const [isSubmittingFollowUp, setIsSubmittingFollowUp] = useState(false);

  useEffect(() => {
    // Fetch questions
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `/api/interview-prep/questions?topic=${topic}&level=${level}&mode=practice`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (topic && level) {
      fetchQuestions();
    }
  }, [topic, level]);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      return;
    }

    setIsSubmitting(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    try {
      const response = await fetch('/api/interview-prep/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: questions[currentIndex].id,
          userAnswer: userAnswer.trim(),
          timeSpentSeconds: timeSpent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const data = await response.json();
      setFeedback(data);
      setShowModelAnswer(true);
    } catch (err) {
      console.error('Error submitting answer:', err);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowModelAnswer(false);
      setFeedback(null);
      setFollowUpAnswer('');
      setShowFollowUpInput(false);
      setFollowUpSubmitted(false);
      setFollowUpFeedback('');
      setStartTime(Date.now());
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserAnswer('');
      setShowModelAnswer(false);
      setFeedback(null);
      setFollowUpAnswer('');
      setShowFollowUpInput(false);
      setFollowUpSubmitted(false);
      setFollowUpFeedback('');
      setStartTime(Date.now());
    }
  };

  const handleShowModelAnswer = () => {
    setShowModelAnswer(true);
  };

  const handleSubmitFollowUp = async () => {
    if (!followUpAnswer.trim() || !feedback) {
      return;
    }

    setIsSubmittingFollowUp(true);

    try {
      const response = await fetch('/api/interview-prep/submit-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: questions[currentIndex].id,
          originalAnswer: userAnswer,
          followUpQuestion: feedback.follow_up_question,
          followUpAnswer: followUpAnswer.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit follow-up answer');
      }

      const data = await response.json();
      setFollowUpFeedback(data.feedback);
      setFollowUpSubmitted(true);
    } catch (err) {
      console.error('Error submitting follow-up answer:', err);
      alert('Failed to submit follow-up answer. Please try again.');
    } finally {
      setIsSubmittingFollowUp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading practice session...</p>
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
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Practice Mode</h1>
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span className="text-sm text-slate-600">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={`${difficultyStyle.color} ${difficultyStyle.textColor} border text-xs`}>
            {currentQuestion.difficulty}
          </Badge>
          {currentQuestion.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl leading-relaxed">
            {currentQuestion.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {/* Answer Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Your Answer</label>
            <Textarea
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              rows={8}
              className="resize-none"
              disabled={feedback !== null}
            />
          </div>

          {/* Action Buttons */}
          {!feedback && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={handleSubmitAnswer}
                disabled={!userAnswer.trim() || isSubmitting}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Answer
                  </>
                )}
              </Button>
              <Button
                onClick={handleShowModelAnswer}
                variant="outline"
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Eye className="h-4 w-4" />
                Show Model Answer
              </Button>
            </div>
          )}

          {/* AI Feedback */}
          {feedback && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">AI Feedback</h3>
                  <p className="text-blue-800 leading-relaxed">{feedback.ai_feedback}</p>
                </div>
                {feedback.follow_up_question && (
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Follow-up Question</h3>
                      <p className="text-blue-800 leading-relaxed italic">
                        {feedback.follow_up_question}
                      </p>
                    </div>

                    {!showFollowUpInput && !followUpSubmitted && (
                      <Button
                        onClick={() => setShowFollowUpInput(true)}
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-blue-50"
                      >
                        Answer Follow-up
                      </Button>
                    )}

                    {showFollowUpInput && !followUpSubmitted && (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Type your follow-up answer here..."
                          value={followUpAnswer}
                          onChange={(e) => setFollowUpAnswer(e.target.value)}
                          rows={4}
                          className="resize-none bg-white"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSubmitFollowUp}
                            disabled={!followUpAnswer.trim() || isSubmittingFollowUp}
                            size="sm"
                            className="bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600"
                          >
                            {isSubmittingFollowUp ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Evaluating...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Submit Follow-up
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => {
                              setShowFollowUpInput(false);
                              setFollowUpAnswer('');
                            }}
                            variant="outline"
                            size="sm"
                            disabled={isSubmittingFollowUp}
                          >
                            Skip
                          </Button>
                        </div>
                      </div>
                    )}

                    {followUpSubmitted && followUpFeedback && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-900 mb-2">Follow-up Feedback</h4>
                        <p className="text-purple-800 leading-relaxed">{followUpFeedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Model Answer */}
          {showModelAnswer && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 sm:p-6 space-y-4">
                <h3 className="font-semibold text-green-900">Model Answer</h3>
                <p className="text-green-800 leading-relaxed">
                  {feedback?.model_answer || currentQuestion.model_answer}
                </p>
                <div className="pt-4 border-t border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Key Points</h4>
                  <ul className="space-y-2">
                    {currentQuestion.key_points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-green-800">
                        <span className="text-green-600">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          className="flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 w-full sm:w-auto"
        >
          Next Question
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      </div>
    </div>
  );
}
