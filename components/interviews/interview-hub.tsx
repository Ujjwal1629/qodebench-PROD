'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { startInterview, getInterviewHistory } from '@/app/actions/interviews';
import { useQuery } from '@tanstack/react-query';
import {
  MessageSquare,
  Code2,
  Network,
  Palette,
  Sparkles,
  Clock,
  Trophy,
  TrendingUp
} from 'lucide-react';

type InterviewType = 'behavioral' | 'technical' | 'system_design' | 'frontend';
type Company = 'google' | 'amazon' | 'meta' | 'microsoft' | 'netflix' | 'apple' | 'general';
type Difficulty = 'easy' | 'medium' | 'hard';

interface InterviewHubProps {
  userId: string;
}

const interviewTypes: Array<{
  type: InterviewType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    type: 'behavioral',
    title: 'Behavioral',
    description: 'STAR method, past experiences, leadership scenarios',
    icon: <MessageSquare className="h-8 w-8" />,
    color: 'bg-blue-500',
  },
  {
    type: 'technical',
    title: 'Technical Coding',
    description: 'Algorithms, data structures, problem solving',
    icon: <Code2 className="h-8 w-8" />,
    color: 'bg-green-500',
  },
  {
    type: 'system_design',
    title: 'System Design',
    description: 'Architecture, scalability, distributed systems',
    icon: <Network className="h-8 w-8" />,
    color: 'bg-purple-500',
  },
  {
    type: 'frontend',
    title: 'Frontend/React',
    description: 'React, hooks, performance, best practices',
    icon: <Palette className="h-8 w-8" />,
    color: 'bg-orange-500',
  },
];

export default function InterviewHub({ userId }: InterviewHubProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company>('general');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [isStarting, setIsStarting] = useState(false);

  // Fetch interview history
  const { data: historyData } = useQuery({
    queryKey: ['interview-history', userId],
    queryFn: async () => {
      const result = await getInterviewHistory();
      return result.data || [];
    },
  });

  const handleStartInterview = async () => {
    if (!selectedType) return;

    setIsStarting(true);
    const result = await startInterview({
      interview_type: selectedType,
      company: selectedCompany,
      difficulty: selectedDifficulty,
    });

    if (result.error) {
      alert(result.error);
      setIsStarting(false);
      return;
    }

    if (result.data) {
      router.push(`/dashboard/interviews/${result.data.id}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Interview Type Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="text-2xl font-semibold">Select Interview Type</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {interviewTypes.map((type) => (
            <Card
              key={type.type}
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                selectedType === type.type
                  ? 'ring-2 ring-blue-600 bg-blue-50'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedType(type.type)}
            >
              <div className={`${type.color} text-white p-3 rounded-lg w-fit mb-3`}>
                {type.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Configuration (shown when type selected) */}
      {selectedType && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Configure Your Interview</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Company Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Target Company
              </label>
              <Select value={selectedCompany} onValueChange={(v) => setSelectedCompany(v as Company)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="meta">Meta</SelectItem>
                  <SelectItem value="microsoft">Microsoft</SelectItem>
                  <SelectItem value="netflix">Netflix</SelectItem>
                  <SelectItem value="apple">Apple</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Company-specific questions and focus areas
              </p>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={(v) => setSelectedDifficulty(v as Difficulty)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Adjusts question complexity
              </p>
            </div>

            {/* Start Button */}
            <div className="flex items-end">
              <Button
                onClick={handleStartInterview}
                disabled={isStarting}
                className="w-full"
                size="lg"
              >
                {isStarting ? 'Starting...' : 'Start Interview'}
              </Button>
            </div>
          </div>

          {/* Interview Features */}
          <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Voice Interaction</p>
                <p className="text-xs text-muted-foreground">
                  Speak naturally with AI interviewer
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Real-time Hints</p>
                <p className="text-xs text-muted-foreground">
                  Get progressive help when stuck
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Trophy className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">AI Feedback</p>
                <p className="text-xs text-muted-foreground">
                  Comprehensive post-interview analysis
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Interview History */}
      {historyData && historyData.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Interviews</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyData.slice(0, 6).map((session: any) => (
              <Card
                key={session.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/dashboard/interviews/${session.id}/report`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="capitalize">
                    {session.interview_type.replace('_', ' ')}
                  </Badge>
                  <Badge
                    variant={
                      session.status === 'completed'
                        ? 'default'
                        : session.status === 'in_progress'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {session.status}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(session.started_at).toLocaleDateString()}
                </p>

                {session.overall_score && (
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold">
                      {session.overall_score.toFixed(1)}/10
                    </span>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                  {session.questions_answered} questions • {session.hints_used} hints used
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
