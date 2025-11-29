'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Award,
  BarChart3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Download,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';

interface ReportData {
  session: any;
  mcqAnswers: any[];
  voiceQAResponses: any[];
  codingSubmissions: any[];
  textQAResponses: any[];
  discussionResponses: any[];
}

export function InterviewReportClient({ data }: { data: ReportData }) {
  const { session, mcqAnswers, voiceQAResponses, codingSubmissions, textQAResponses, discussionResponses } = data;

  // Calculate overall score
  const stageScores = session.stage_scores || {};
  const scores = [
    stageScores.stage_1 || 0,
    stageScores.stage_2 || 0,
    stageScores.stage_3 || 0,
    stageScores.stage_4 || 0,
    stageScores.stage_5 || 0,
  ];

  // Weighted average: MCQ (15%), Voice (15%), Coding (35%), Text QA (15%), Discussion (20%)
  const overallScore =
    scores[0] * 0.15 + scores[1] * 0.15 + scores[2] * 0.35 + scores[3] * 0.15 + scores[4] * 0.2;

  const getPerformanceLevel = (score: number) => {
    if (score >= 9) return { label: 'Excellent', color: 'text-green-600 dark:text-green-400' };
    if (score >= 7) return { label: 'Good', color: 'text-blue-600 dark:text-blue-400' };
    if (score >= 5) return { label: 'Average', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Needs Improvement', color: 'text-red-600 dark:text-red-400' };
  };

  const performance = getPerformanceLevel(overallScore);

  return (
    <div className="container max-w-7xl space-y-6 sm:space-y-8 py-4 sm:py-8 px-3 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 w-full sm:w-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/dashboard/interviews">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Back to Interviews
              </Button>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Interview Performance Report</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Completed{' '}
            {session.completed_at
              ? formatDistanceToNow(new Date(session.completed_at), { addSuffix: true })
              : 'recently'}
          </p>
        </div>

        <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
          <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Download PDF
        </Button>
      </div>

      {/* Overall Score Card */}
      <Card className="border-2">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold">{overallScore.toFixed(1)}</span>
                  <span className="text-lg sm:text-xl md:text-2xl text-muted-foreground">/ 10</span>
                </div>
                <p className={`mt-2 text-base sm:text-lg font-semibold ${performance.color}`}>{performance.label}</p>
              </div>

              <Progress value={overallScore * 10} className="h-2 sm:h-3" />

              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-muted-foreground">Experience Level</p>
                  <p className="font-medium capitalize">{session.experience_level || 'Junior'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {session.completed_at && session.created_at
                      ? `${Math.round(
                          (new Date(session.completed_at).getTime() - new Date(session.created_at).getTime()) /
                            1000 /
                            60
                        )} minutes`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-sm sm:text-base">Stage Scores</h3>
              {[
                { name: 'MCQ', score: stageScores.stage_1 || 0, weight: '15%' },
                { name: 'Voice Q&A', score: stageScores.stage_2 || 0, weight: '15%' },
                { name: 'Coding', score: stageScores.stage_3 || 0, weight: '35%' },
                { name: 'Text Q&A', score: stageScores.stage_4 || 0, weight: '15%' },
                { name: 'Discussion', score: stageScores.stage_5 || 0, weight: '20%' },
              ].map((stage) => (
                <div key={stage.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="min-w-[60px] sm:min-w-[100px] text-xs sm:text-sm font-medium truncate">{stage.name}</span>
                    <Badge variant="outline" className="text-[10px] sm:text-xs flex-shrink-0">
                      {stage.weight}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <Progress value={stage.score * 10} className="h-1.5 sm:h-2 w-16 sm:w-24" />
                    <span className="min-w-[40px] sm:min-w-[50px] text-right text-xs sm:text-sm font-medium">
                      {stage.score.toFixed(1)}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown Tabs */}
      <Tabs defaultValue="mcq" className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-5 min-w-[500px]">
            <TabsTrigger value="mcq" className="text-xs sm:text-sm">MCQ</TabsTrigger>
            <TabsTrigger value="voice" className="text-xs sm:text-sm">Voice Q&A</TabsTrigger>
            <TabsTrigger value="coding" className="text-xs sm:text-sm">Coding</TabsTrigger>
            <TabsTrigger value="text" className="text-xs sm:text-sm">Text Q&A</TabsTrigger>
            <TabsTrigger value="discussion" className="text-xs sm:text-sm">Discussion</TabsTrigger>
          </TabsList>
        </div>

        {/* MCQ Tab */}
        <TabsContent value="mcq" className="space-y-3 sm:space-y-4 mt-0">
          <MCQBreakdown answers={mcqAnswers} score={stageScores.stage_1 || 0} />
        </TabsContent>

        {/* Voice QA Tab */}
        <TabsContent value="voice" className="space-y-3 sm:space-y-4 mt-0">
          <VoiceQABreakdown responses={voiceQAResponses} score={stageScores.stage_2 || 0} />
        </TabsContent>

        {/* Coding Tab */}
        <TabsContent value="coding" className="space-y-3 sm:space-y-4 mt-0">
          <CodingBreakdown submissions={codingSubmissions} score={stageScores.stage_3 || 0} />
        </TabsContent>

        {/* Text QA Tab */}
        <TabsContent value="text" className="space-y-3 sm:space-y-4 mt-0">
          <TextQABreakdown responses={textQAResponses} score={stageScores.stage_4 || 0} />
        </TabsContent>

        {/* Discussion Tab */}
        <TabsContent value="discussion" className="space-y-3 sm:space-y-4 mt-0">
          <DiscussionBreakdown responses={discussionResponses} score={stageScores.stage_5 || 0} />
        </TabsContent>
      </Tabs>

      {/* Insights and Recommendations */}
      <InsightsSection data={data} overallScore={overallScore} />
    </div>
  );
}

function MCQBreakdown({ answers, score }: { answers: any[]; score: number }) {
  const correctCount = answers.filter((a) => a.is_correct).length;
  const totalCount = answers.length;
  const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-base sm:text-lg">
          <span>Multiple Choice Questions</span>
          <Badge variant={score >= 7 ? 'default' : score >= 5 ? 'secondary' : 'destructive'} className="text-xs sm:text-sm w-fit">
            {correctCount}/{totalCount} Correct
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">{accuracy.toFixed(0)}% Accuracy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        {answers.map((answer, index) => (
          <MCQQuestionCard key={answer.id} answer={answer} index={index} />
        ))}
      </CardContent>
    </Card>
  );
}

function MCQQuestionCard({ answer, index }: { answer: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const question = answer.interview_mcq_questions;

  return (
    <div className="rounded-lg border p-3 sm:p-4">
      <div className="flex items-start gap-2 sm:gap-3">
        <div
          className={`flex h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full ${
            answer.is_correct ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {answer.is_correct ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />}
        </div>

        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <p className="font-medium text-xs sm:text-sm break-words">
              {index + 1}. {question?.question_text || 'Question not found'}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0 h-8 w-8 p-0"
            >
              {isExpanded ? <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
          </div>

          {isExpanded && question && (
            <div className="space-y-2 sm:space-y-3 pt-2">
              <div className="grid gap-1.5 sm:gap-2">
                {['a', 'b', 'c', 'd'].map((option) => {
                  const isSelected = answer.selected_option === option;
                  const isCorrect = question.correct_option === option;

                  return (
                    <div
                      key={option}
                      className={`rounded-md border p-2 sm:p-3 ${
                        isCorrect
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                          : isSelected
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="font-medium uppercase text-xs sm:text-sm flex-shrink-0">{option}.</span>
                        <span className="text-xs sm:text-sm break-words min-w-0">{question[`option_${option}`]}</span>
                        {isCorrect && <CheckCircle2 className="ml-auto h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />}
                        {isSelected && !isCorrect && <XCircle className="ml-auto h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {question.explanation && (
                <div className="rounded-md bg-muted p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-medium">Explanation:</p>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground break-words">{question.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VoiceQABreakdown({ responses, score }: { responses: any[]; score: number }) {
  const avgScore = responses.length > 0 ? responses.reduce((sum, r) => sum + (r.ai_score || 0), 0) / responses.length : 0;

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-base sm:text-lg">
          <span>Voice & Behavioral Questions</span>
          <Badge variant={score >= 7 ? 'default' : score >= 5 ? 'secondary' : 'destructive'} className="text-xs sm:text-sm w-fit">
            {avgScore.toFixed(1)}/10 Avg
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">{responses.length} questions answered</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        {responses.map((response, index) => (
          <ResponseCard key={response.id} response={response} index={index} />
        ))}
      </CardContent>
    </Card>
  );
}

function TextQABreakdown({ responses, score }: { responses: any[]; score: number }) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-base sm:text-lg">
          <span>Text Q&A - Technical Concepts</span>
          <Badge variant={score >= 7 ? 'default' : score >= 5 ? 'secondary' : 'destructive'} className="text-xs sm:text-sm w-fit">
            {score.toFixed(1)}/10
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">{responses.length} questions answered</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        {responses.map((response, index) => (
          <ResponseCard key={response.id} response={response} index={index} />
        ))}
      </CardContent>
    </Card>
  );
}

function DiscussionBreakdown({ responses, score }: { responses: any[]; score: number }) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-base sm:text-lg">
          <span>System Design Discussion</span>
          <Badge variant={score >= 7 ? 'default' : score >= 5 ? 'secondary' : 'destructive'} className="text-xs sm:text-sm w-fit">
            {score.toFixed(1)}/10
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">{responses.length} questions answered</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        {responses.map((response, index) => (
          <ResponseCard key={response.id} response={response} index={index} />
        ))}
      </CardContent>
    </Card>
  );
}

function ResponseCard({ response, index }: { response: any; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const question =
    response.interview_voice_qa_questions ||
    response.interview_text_qa_questions ||
    response.interview_discussion_questions;

  const evaluation = response.ai_evaluation || response.evaluation_feedback || {};
  const score = response.ai_score || response.evaluation_score || 0;

  const scoreColor =
    score >= 7 ? 'text-green-600' : score >= 5 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="rounded-lg border p-3 sm:p-4">
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 sm:gap-3">
            <span className={`text-lg sm:text-xl md:text-2xl font-bold ${scoreColor} flex-shrink-0`}>{score.toFixed(1)}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-xs sm:text-sm break-words">
                {index + 1}. {question?.question_text || 'Question not found'}
              </p>
              <p className="mt-1 text-[10px] sm:text-xs md:text-sm text-muted-foreground break-words">
                {response.response_text?.substring(0, 150)}
                {response.response_text?.length > 150 && '...'}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0 h-8 w-8 p-0"
        >
          {isExpanded ? <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 border-t pt-3 sm:pt-4">
          <div>
            <p className="text-xs sm:text-sm font-medium">Your Response:</p>
            <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-2 sm:p-3 text-[10px] sm:text-xs md:text-sm break-words">{response.response_text}</p>
          </div>

          {evaluation.strengths && evaluation.strengths.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-green-600">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                Strengths
              </p>
              <ul className="mt-2 space-y-1 pl-4 sm:pl-6">
                {evaluation.strengths.map((strength: string, i: number) => (
                  <li key={i} className="text-[10px] sm:text-xs md:text-sm text-muted-foreground break-words">
                    • {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {evaluation.improvements && evaluation.improvements.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-orange-600">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                Areas for Improvement
              </p>
              <ul className="mt-2 space-y-1 pl-4 sm:pl-6">
                {evaluation.improvements.map((improvement: string, i: number) => (
                  <li key={i} className="text-[10px] sm:text-xs md:text-sm text-muted-foreground break-words">
                    • {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CodingBreakdown({ submissions, score }: { submissions: any[]; score: number }) {
  const submission = submissions[0]; // Typically one coding challenge

  if (!submission) {
    return (
      <Card>
        <CardContent className="py-6 sm:py-8 text-center text-muted-foreground text-xs sm:text-sm">
          No coding submission found
        </CardContent>
      </Card>
    );
  }

  const challenge = submission.interview_coding_challenges;
  const testResults = submission.test_results || [];
  const passedTests = submission.tests_passed || 0;
  const totalTests = submission.tests_total || 0;
  const codeQuality = submission.code_quality_score || 0;

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-base sm:text-lg">
          <span className="break-words">{challenge?.title || 'Coding Challenge'}</span>
          <Badge variant={score >= 7 ? 'default' : score >= 5 ? 'secondary' : 'destructive'} className="text-xs sm:text-sm w-fit">
            {score.toFixed(1)}/10
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm break-words">{challenge?.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Test Results */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0">
            <h3 className="font-semibold text-sm sm:text-base">Test Cases</h3>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {passedTests}/{totalTests} Passed
            </span>
          </div>
          <Progress value={(passedTests / totalTests) * 100} className="mt-2 h-1.5 sm:h-2" />

          <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
            {testResults.map((result: any, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-md border p-2 sm:p-3 ${
                  result.passed
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                }`}
              >
                <span className="text-xs sm:text-sm font-medium">Test Case {index + 1}</span>
                {result.passed ? (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Code Quality */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm sm:text-base">Code Quality</h3>
            <span className="text-xs sm:text-sm font-medium">{codeQuality.toFixed(1)}/10</span>
          </div>
          <Progress value={codeQuality * 10} className="mt-2 h-1.5 sm:h-2" />

          {submission.ai_feedback && (
            <div className="mt-3 sm:mt-4 rounded-md bg-muted p-3 sm:p-4">
              <p className="text-xs sm:text-sm font-medium">AI Feedback:</p>
              <p className="mt-2 text-[10px] sm:text-xs md:text-sm text-muted-foreground break-words">
                {typeof submission.ai_feedback === 'string'
                  ? submission.ai_feedback
                  : submission.ai_feedback.feedback || JSON.stringify(submission.ai_feedback)}
              </p>
            </div>
          )}
        </div>

        {/* Submitted Code */}
        <div>
          <h3 className="mb-2 font-semibold text-sm sm:text-base">Your Solution</h3>
          <pre className="overflow-x-auto rounded-md bg-muted p-3 sm:p-4 text-[10px] sm:text-xs">
            <code className="break-all">{submission.submitted_code}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightsSection({ data, overallScore }: { data: ReportData; overallScore: number }) {
  const { mcqAnswers, voiceQAResponses, textQAResponses, discussionResponses, codingSubmissions } = data;

  // Generate insights
  const insights: { type: 'strength' | 'improvement'; text: string }[] = [];

  // MCQ Insights
  const mcqCorrect = mcqAnswers.filter((a) => a.is_correct).length;
  const mcqTotal = mcqAnswers.length;
  if (mcqTotal > 0) {
    const mcqAccuracy = (mcqCorrect / mcqTotal) * 100;
    if (mcqAccuracy >= 80) {
      insights.push({
        type: 'strength',
        text: `Strong foundational knowledge with ${mcqAccuracy.toFixed(0)}% accuracy on MCQ questions`,
      });
    } else if (mcqAccuracy < 50) {
      insights.push({
        type: 'improvement',
        text: `Review core concepts - only ${mcqAccuracy.toFixed(0)}% accuracy on MCQ questions. Practice with learning modules.`,
      });
    }
  }

  // Coding Insights
  if (codingSubmissions.length > 0) {
    const submission = codingSubmissions[0];
    const testAccuracy = (submission.tests_passed / submission.tests_total) * 100;

    if (testAccuracy === 100) {
      insights.push({ type: 'strength', text: 'All test cases passed! Excellent problem-solving skills.' });
    } else if (testAccuracy >= 70) {
      insights.push({ type: 'strength', text: `Good coding skills with ${testAccuracy.toFixed(0)}% test cases passed` });
    } else {
      insights.push({
        type: 'improvement',
        text: 'Focus on edge case handling and algorithm correctness. Practice more coding challenges.',
      });
    }

    if (submission.code_quality_score >= 8) {
      insights.push({ type: 'strength', text: 'High code quality with clean, readable implementation' });
    } else if (submission.code_quality_score < 5) {
      insights.push({
        type: 'improvement',
        text: 'Improve code quality: add comments, use better variable names, and follow best practices',
      });
    }
  }

  // Communication Insights (Voice + Discussion)
  const commResponses = [...voiceQAResponses, ...discussionResponses];
  if (commResponses.length > 0) {
    const avgCommScore =
      commResponses.reduce((sum, r) => sum + (r.ai_score || r.evaluation_score || 0), 0) / commResponses.length;

    if (avgCommScore >= 8) {
      insights.push({ type: 'strength', text: 'Excellent communication skills with clear, detailed responses' });
    } else if (avgCommScore < 5) {
      insights.push({
        type: 'improvement',
        text: 'Work on communication clarity. Use the STAR method for behavioral questions and provide more specific examples.',
      });
    }
  }

  // Overall performance insight
  if (overallScore >= 8) {
    insights.push({
      type: 'strength',
      text: 'Outstanding overall performance! You demonstrate strong technical and soft skills for this level.',
    });
  } else if (overallScore < 6) {
    insights.push({
      type: 'improvement',
      text: 'Continue practicing across all areas. Focus on the learning modules and take more mock interviews.',
    });
  }

  const strengths = insights.filter((i) => i.type === 'strength');
  const improvements = insights.filter((i) => i.type === 'improvement');

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
          Insights & Recommendations
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">Personalized feedback based on your performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {strengths.length > 0 && (
          <div>
            <h3 className="mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg font-semibold text-green-600">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              Your Strengths
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {strengths.map((insight, index) => (
                <li key={index} className="flex gap-2 sm:gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-green-600" />
                  <span className="text-xs sm:text-sm break-words">{insight.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {improvements.length > 0 && (
          <div>
            <h3 className="mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg font-semibold text-orange-600">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              Areas to Improve
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {improvements.map((insight, index) => (
                <li key={index} className="flex gap-2 sm:gap-3">
                  <TrendingDown className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-orange-600" />
                  <span className="text-xs sm:text-sm break-words">{insight.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Separator />

        <div className="space-y-2 sm:space-y-3">
          <h3 className="font-semibold text-sm sm:text-base">Recommended Next Steps</h3>
          <div className="grid gap-2 sm:gap-3">
            <Link href="/dashboard/learning">
              <Button variant="outline" className="w-full justify-start text-xs sm:text-sm h-9 sm:h-10">
                Explore Learning Modules
              </Button>
            </Link>
            <Link href="/dashboard/challenges">
              <Button variant="outline" className="w-full justify-start text-xs sm:text-sm h-9 sm:h-10">
                Practice Coding Challenges
              </Button>
            </Link>
            <Link href="/dashboard/interviews">
              <Button variant="outline" className="w-full justify-start text-xs sm:text-sm h-9 sm:h-10">
                Take Another Mock Interview
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
