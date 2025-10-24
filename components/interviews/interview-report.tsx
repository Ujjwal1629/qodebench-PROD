'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  // Download, // Temporarily removed
  // Share2, // Temporarily removed
} from 'lucide-react';

interface InterviewReportProps {
  session: any;
  responses: any[];
}

export default function InterviewReport({ session, responses }: InterviewReportProps) {
  const aiReport = session.ai_feedback || {};

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'Outstanding';
    if (score >= 8) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 6) return 'Fair';
    return 'Needs Improvement';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg">
            <Trophy className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Interview Complete!</h1>
            <p className="text-muted-foreground">
              Here&apos;s your comprehensive performance analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Badge variant="outline" className="capitalize">
            {session.interview_type.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {session.company}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {session.difficulty}
          </Badge>
          <span className="text-sm text-muted-foreground">
            <Clock className="h-3 w-3 inline mr-1" />
            {formatDuration(session.duration_seconds || 0)}
          </span>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className={`p-6 border-2 ${getScoreColor(session.overall_score || 0)}`}>
          <p className="text-sm font-medium mb-2">Overall Score</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold">{session.overall_score?.toFixed(1) || '0.0'}</p>
            <p className="text-lg mb-1 text-muted-foreground">/10</p>
          </div>
          <p className="text-xs font-medium mt-2">{getScoreLabel(session.overall_score || 0)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Communication
          </p>
          <p className="text-3xl font-bold mb-2">
            {session.communication_score?.toFixed(1) || '0.0'}
          </p>
          <Progress value={(session.communication_score || 0) * 10} className="h-2" />
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Technical
          </p>
          <p className="text-3xl font-bold mb-2">{session.technical_score?.toFixed(1) || '0.0'}</p>
          <Progress value={(session.technical_score || 0) * 10} className="h-2" />
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Problem Solving
          </p>
          <p className="text-3xl font-bold mb-2">
            {session.problem_solving_score?.toFixed(1) || '0.0'}
          </p>
          <Progress value={(session.problem_solving_score || 0) * 10} className="h-2" />
        </Card>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{session.questions_answered}</p>
              <p className="text-sm text-muted-foreground">Questions Answered</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{session.hints_used}</p>
              <p className="text-sm text-muted-foreground">Hints Used</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatDuration(session.duration_seconds || 0)}</p>
              <p className="text-sm text-muted-foreground">Total Duration</p>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Feedback Sections */}
      {aiReport.overall_summary && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Overall Summary</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{aiReport.overall_summary}</p>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        {aiReport.strengths && aiReport.strengths.length > 0 && (
          <Card className="p-6 bg-green-50 border-green-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Key Strengths
            </h2>
            <ul className="space-y-2">
              {aiReport.strengths.map((strength: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Areas for Improvement */}
        {aiReport.areas_for_improvement && aiReport.areas_for_improvement.length > 0 && (
          <Card className="p-6 bg-orange-50 border-orange-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              Areas for Improvement
            </h2>
            <ul className="space-y-2">
              {aiReport.areas_for_improvement.map((area: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{area}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Detailed Feedback by Question */}
      {responses.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Question-by-Question Breakdown</h2>
          <div className="space-y-4">
            {responses.map((response: any, index: number) => (
              <div key={response.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-2">
                      Question {index + 1}
                    </Badge>
                    <h3 className="font-medium mb-2">{response.interview_questions.question_text}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{response.quality_score?.toFixed(1) || '-'}</p>
                    <p className="text-xs text-muted-foreground">/10</p>
                  </div>
                </div>

                {response.ai_evaluation && (
                  <div className="space-y-2 text-sm">
                    {response.ai_evaluation.strengths?.length > 0 && (
                      <div>
                        <p className="font-medium text-green-700 mb-1">✓ Strengths:</p>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {response.ai_evaluation.strengths.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {response.ai_evaluation.weaknesses?.length > 0 && (
                      <div>
                        <p className="font-medium text-orange-700 mb-1">! Areas to Improve:</p>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {response.ai_evaluation.weaknesses.map((w: string, i: number) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Improvement Roadmap - Temporarily hidden */}
      {/*
      {aiReport.improvement_roadmap && aiReport.improvement_roadmap.length > 0 && (
        <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Your Personalized Improvement Roadmap
          </h2>
          <div className="space-y-4">
            {aiReport.improvement_roadmap.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    variant={
                      item.priority === 'high'
                        ? 'destructive'
                        : item.priority === 'medium'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {item.priority} priority
                  </Badge>
                  <h3 className="font-semibold">{item.skill}</h3>
                </div>
                {item.recommended_actions && (
                  <ul className="text-sm space-y-1 ml-4">
                    {item.recommended_actions.map((action: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
      */}

      {/* Next Steps */}
      {aiReport.next_steps && aiReport.next_steps.length > 0 && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Recommended Next Steps</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {aiReport.next_steps.map((step: string, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/dashboard/interviews">Practice Another Interview</Link>
        </Button>
        {/* Temporarily hidden - Coming soon
        <Button variant="outline" size="lg">
          <Share2 className="h-4 w-4 mr-2" />
          Share Report
        </Button>
        <Button variant="outline" size="lg">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        */}
      </div>
    </div>
  );
}
