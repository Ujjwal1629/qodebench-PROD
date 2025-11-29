'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Download,
  Loader2,
  TrendingUp,
  TrendingDown,
  Award,
  FileText,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

interface ResultsStageProps {
  sessionId: string;
}

interface StageScore {
  stage: string;
  title: string;
  score: number;
  maxScore: number;
}

interface InterviewReport {
  overall_score: number;
  stage_scores: StageScore[];
  strengths: string[];
  improvements: string[];
  detailed_feedback: Array<{
    stage: string;
    responses: Array<{
      question_text: string;
      score: number;
      feedback: {
        strengths: string[];
        improvements: string[];
      };
    }>;
  }>;
  performance_level: string;
}

export default function ResultsStage({ sessionId }: ResultsStageProps) {
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch('/api/interview/stages/results/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) throw new Error('Failed to fetch report');

        const data = await response.json();
        setReport(data.report);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching report:', error);
        toast.error('Failed to load interview report');
      }
    };

    fetchReport();
  }, [sessionId]);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const response = await fetch('/api/interview/stages/results/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-report-${sessionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading || !report) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium">Generating your interview report...</p>
        </div>
      </div>
    );
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-blue-600';
    if (score >= 4) return 'text-amber-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (level: string) => {
    const colors: Record<string, string> = {
      excellent: 'bg-green-100 text-green-800 border-green-300',
      good: 'bg-blue-100 text-blue-800 border-blue-300',
      average: 'bg-amber-100 text-amber-800 border-amber-300',
      'needs-improvement': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[level] || colors.average;
  };

  // Prepare chart data
  const barChartData = report.stage_scores.map((stage) => ({
    name: stage.title,
    score: stage.score,
    maxScore: stage.maxScore,
  }));

  const radarChartData = report.stage_scores.map((stage) => ({
    stage: stage.title,
    score: (stage.score / stage.maxScore) * 100,
  }));

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
      {/* Overall Score Card */}
      <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div className="w-full md:w-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Award className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-amber-500" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Interview Complete!</h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-3 sm:mb-4">
              Congratulations on completing all stages of the interview
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Overall Score</p>
                <p className={`text-3xl sm:text-4xl md:text-5xl font-bold ${getPerformanceColor(report.overall_score)}`}>
                  {report.overall_score.toFixed(1)}/10
                </p>
              </div>
              <div>
                <Badge
                  variant="outline"
                  className={`text-sm sm:text-base md:text-lg px-3 py-1.5 sm:px-4 sm:py-2 ${getPerformanceBadge(report.performance_level)}`}
                >
                  {report.performance_level.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:gap-3 w-full md:w-auto">
            <Link href={`/dashboard/interviews/${sessionId}/report`} className="w-full">
              <Button size="lg" className="w-full text-sm sm:text-base">
                <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                View Detailed Report
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Bar Chart */}
        <Card className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold">Score Breakdown by Stage</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-15}
                textAnchor="end"
                height={80}
                interval={0}
                style={{ fontSize: '10px' }}
              />
              <YAxis domain={[0, 10]} style={{ fontSize: '10px' }} />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar Chart */}
        <Card className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold">Performance Radar</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarChartData}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="stage"
                style={{ fontSize: '9px' }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Score %"
                dataKey="score"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Strengths and Improvements */}
      <div className="grid lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Strengths */}
        <Card className="p-3 sm:p-4 md:p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-green-900">Key Strengths</h2>
          </div>
          <ul className="space-y-1.5 sm:space-y-2">
            {report.strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-green-900 text-xs sm:text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Improvements */}
        <Card className="p-3 sm:p-4 md:p-6 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-amber-900">Areas for Improvement</h2>
          </div>
          <ul className="space-y-1.5 sm:space-y-2">
            {report.improvements.map((improvement, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-amber-900 text-xs sm:text-sm">{improvement}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Stage Scores Summary */}
      <Card className="p-3 sm:p-4 md:p-6">
        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4">Stage-wise Performance</h2>
        <div className="space-y-2 sm:space-y-3">
          {report.stage_scores.map((stage, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="font-medium text-xs sm:text-sm">{stage.title}</span>
                <span className={`font-bold text-xs sm:text-sm ${getPerformanceColor(stage.score)}`}>
                  {stage.score.toFixed(1)}/{stage.maxScore}
                </span>
              </div>
              <Progress value={(stage.score / stage.maxScore) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-center pb-4">
        <Button variant="outline" onClick={() => window.location.href = '/dashboard/interviews'} className="w-full sm:w-auto text-xs sm:text-sm">
          Back to Interviews
        </Button>
      </div>
    </div>
  );
}
