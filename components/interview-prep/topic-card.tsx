'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Code2, Braces, Server, Database, Layers, Network } from 'lucide-react';
import type { InterviewPrepTopic } from '@/types/interview-prep';
import { INTERVIEW_TOPICS } from '@/types/interview-prep';

interface TopicCardProps {
  topic: InterviewPrepTopic;
  level: 'fresher' | 'experienced';
  totalQuestions: number;
  attemptedQuestions?: number;
  completionPercentage?: number;
}

// Icon mapping for topics
const TOPIC_ICONS: Record<InterviewPrepTopic, typeof Code2> = {
  javascript: Braces,
  react: Code2,
  node: Server,
  mongodb: Database,
  fullstack: Layers,
  'system-design': Network,
};

export function TopicCard({
  topic,
  level,
  totalQuestions,
  attemptedQuestions = 0,
  completionPercentage = 0,
}: TopicCardProps) {
  const topicInfo = INTERVIEW_TOPICS[topic];
  const Icon = TOPIC_ICONS[topic];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className={`p-3 rounded-lg ${topicInfo.color} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${topicInfo.color.replace('bg-', 'text-')}`} />
          </div>
          <Badge variant="outline" className="text-xs">
            {totalQuestions} questions
          </Badge>
        </div>
        <CardTitle className="text-xl">{topicInfo.title}</CardTitle>
        <CardDescription className="text-sm">
          {topicInfo.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress */}
        {attemptedQuestions > 0 && (
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Progress</span>
              <span className="font-medium">{attemptedQuestions}/{totalQuestions}</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Link href={`/dashboard/interview-prep/flashcard?topic=${topic}&level=${level}`}>
              Flashcards
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="w-full bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 text-white"
          >
            <Link href={`/dashboard/interview-prep/practice?topic=${topic}&level=${level}`}>
              Practice
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
