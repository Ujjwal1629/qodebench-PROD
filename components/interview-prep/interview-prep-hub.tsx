'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BookOpen, Zap } from 'lucide-react';
import { TopicCard } from './topic-card';
import { ProgressStats } from './progress-stats';
import type { InterviewPrepTopic, InterviewPrepLevel } from '@/types/interview-prep';

export function InterviewPrepHub() {
  const [selectedLevel, setSelectedLevel] = useState<InterviewPrepLevel>('fresher');
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  useEffect(() => {
    // Fetch user progress
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/interview-prep/progress');
        if (response.ok) {
          const data = await response.json();
          setProgress(data);
          setTotalQuestions(data.totalQuestions || 0);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const topics: InterviewPrepTopic[] = ['javascript', 'react', 'node', 'mongodb', 'fullstack', 'system-design'];

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-brand-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Interview Preparation
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
            100% Free
          </Badge>
          <Badge variant="outline">
            {loading ? '...' : totalQuestions} MERN Stack Questions
          </Badge>
        </div>
        <p className="text-lg text-slate-600 max-w-3xl">
          Practice MERN stack interview questions with flashcards and AI-powered feedback.
          Perfect for fresher and experienced developers preparing for technical interviews.
        </p>
      </div>

      {/* Progress Stats */}
      {!loading && progress && progress.stats.totalAttempted > 0 && (
        <ProgressStats stats={progress.stats} topicProgress={progress.topicProgress} />
      )}

      {/* Level Selection */}
      <Tabs defaultValue="fresher" value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as InterviewPrepLevel)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="fresher" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Fresher / Intern
          </TabsTrigger>
          <TabsTrigger value="experienced" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Experienced
          </TabsTrigger>
        </TabsList>

        {/* Fresher Level */}
        <TabsContent value="fresher" className="mt-6">
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-xl text-green-900">Fresher Level</CardTitle>
              <CardDescription className="text-green-700">
                Entry-level questions covering fundamentals: HTML/CSS, JavaScript basics, React basics,
                Node.js fundamentals, MongoDB CRUD, and REST APIs.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => {
              const topicProgressData = progress?.topicProgress?.[topic] || { total: 0, attempted: 0, percentage: 0, fresherTotal: 0, experiencedTotal: 0 };
              const fresherCount = topicProgressData.fresherTotal || 0;
              // For attempted, we need to filter by level - for now use approximation
              const fresherAttempted = Math.ceil(topicProgressData.attempted / 2);

              return (
                <TopicCard
                  key={topic}
                  topic={topic}
                  level="fresher"
                  totalQuestions={fresherCount}
                  attemptedQuestions={fresherAttempted}
                  completionPercentage={topicProgressData.percentage}
                />
              );
            })}
          </div>
        </TabsContent>

        {/* Experienced Level */}
        <TabsContent value="experienced" className="mt-6">
          <Card className="mb-6 bg-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-xl text-orange-900">Experienced Level</CardTitle>
              <CardDescription className="text-orange-700">
                Advanced questions covering: React optimization (useMemo/useCallback), custom hooks,
                Node.js performance, authentication, MongoDB aggregation/indexing, and system design.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => {
              const topicProgressData = progress?.topicProgress?.[topic] || { total: 0, attempted: 0, percentage: 0, fresherTotal: 0, experiencedTotal: 0 };
              const experiencedCount = topicProgressData.experiencedTotal || 0;
              // For attempted, we need to filter by level - for now use approximation
              const experiencedAttempted = Math.floor(topicProgressData.attempted / 2);

              return (
                <TopicCard
                  key={topic}
                  topic={topic}
                  level="experienced"
                  totalQuestions={experiencedCount}
                  attemptedQuestions={experiencedAttempted}
                  completionPercentage={topicProgressData.percentage}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Flashcard Mode</CardTitle>
            <CardDescription>
              Quick review format with question on front and key points on back.
              Perfect for memorizing important concepts before interviews.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Practice Mode</CardTitle>
            <CardDescription>
              Write your own answers and get AI-powered feedback comparing your response
              to model answers. Includes follow-up questions to deepen understanding.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
