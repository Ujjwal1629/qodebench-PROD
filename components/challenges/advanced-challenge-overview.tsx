'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Zap, Building2, Clock, Award, Target, CheckCircle2, Loader2 } from 'lucide-react';
import { ChallengeMarkdownRenderer } from '@/components/challenges/challenge-markdown-renderer';

interface AdvancedChallengeOverviewProps {
  challenge: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    difficulty: string | null;
    points: number;
    estimated_time?: number | null;
    tier: string | null;
    learning_objectives?: string[] | null;
  };
}

export function AdvancedChallengeOverview({ challenge }: AdvancedChallengeOverviewProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const getDifficultyColor = () => {
    switch (challenge.difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'hard':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/challenges/advanced')}
            className="gap-2 text-slate-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Advanced Challenges
          </Button>
        </div>

        {/* Main Content Card */}
        <Card className="border-2 border-purple-200 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 px-6 py-6 border-b border-purple-200">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                <Zap className="h-3 w-3 mr-1" />
                Advanced Challenge
              </Badge>
              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                <Building2 className="h-3 w-3 mr-1" />
                Office Simulation
              </Badge>
              <Badge variant="outline" className={getDifficultyColor()}>
                {challenge.difficulty || 'Medium'}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {challenge.title}
            </h1>

            {/* Teaser */}
            <p className="text-sm text-purple-700 font-medium">
              Experience a real-world office simulation with CTO briefing, Jira ticket, and production codebase.
            </p>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Challenge Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="font-medium">{challenge.points} points</span>
              </div>
              {challenge.estimated_time && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span>~{challenge.estimated_time} min</span>
                </div>
              )}
            </div>

            {/* Description */}
            {challenge.description && (
              <div>
                <h2 className="text-sm font-semibold text-slate-900 mb-2">Description</h2>
                <ChallengeMarkdownRenderer content={challenge.description} />
              </div>
            )}

            {/* Learning Objectives */}
            {challenge.learning_objectives && challenge.learning_objectives.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  What You&apos;ll Learn
                </h2>
                <ul className="space-y-2">
                  {challenge.learning_objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Challenge Flow Preview */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Challenge Flow</h2>
              <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                <span className="px-2 py-1 bg-white rounded border border-slate-200">1. CTO Brief</span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <span className="px-2 py-1 bg-white rounded border border-slate-200">2. Jira Ticket</span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <span className="px-2 py-1 bg-white rounded border border-slate-200">3. Workspace</span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <span className="px-2 py-1 bg-white rounded border border-slate-200">4. Submit</span>
              </div>
            </div>
          </CardContent>

          {/* Footer with Action */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <Button
              onClick={() => {
                setIsLoading(true);
                router.push(`/dashboard/challenges/${challenge.slug}/brief`);
              }}
              size="lg"
              disabled={isLoading}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Start Challenge
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
