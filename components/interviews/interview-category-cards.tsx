'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Lightbulb, Target, Lock } from 'lucide-react';

interface InterviewCategoryCardsProps {
  interviewPrepProgress?: {
    totalQuestions: number;
    attemptedQuestions: number;
    percentage: number;
  };
  mockInterviewProgress?: {
    completedInterviews: number;
  };
}

export function InterviewCategoryCards({
  interviewPrepProgress,
  mockInterviewProgress,
}: InterviewCategoryCardsProps) {
  const prepAttempted = interviewPrepProgress?.attemptedQuestions || 0;
  const prepTotal = interviewPrepProgress?.totalQuestions || 40;
  const mockCompleted = mockInterviewProgress?.completedInterviews || 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Category 1: Interview Prep (Free) */}
      <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group overflow-visible">
        <CardHeader className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform">
              <Lightbulb className="h-8 w-8 text-blue-600" />
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300 hover:bg-green-100">
              100% Free
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Interview Prep
            </h3>
            <p className="text-sm text-slate-600">
              MERN Stack Questions - Practice technical interviews with flashcards and interactive sessions
            </p>
          </div>

          {/* Progress Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-slate-600">
                {prepAttempted} / {prepTotal} questions
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-slate-600">6 topics</span>
            </div>
          </div>

          {/* Topic Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
              💡 JavaScript
            </Badge>
            <Badge variant="outline" className="text-xs bg-cyan-50 text-cyan-700 border-cyan-200">
              ⚛️ React.js
            </Badge>
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              🟢 Node.js
            </Badge>
          </div>

          {/* Features */}
          <div className="space-y-1 text-xs text-slate-600">
            <p>✓ 40 MERN stack questions</p>
            <p>✓ Flashcards & practice modes</p>
            <p>✓ AI-powered feedback</p>
          </div>

          <Button asChild className="w-full group-hover:bg-blue-700">
            <Link href="/dashboard/interview-prep">
              Start Practicing
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Category 2: Mock Interviews (Premium) */}
      <Card className="border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 group overflow-visible">
        <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100">
              <Lock className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Mock Interviews
            </h3>
            <p className="text-sm text-slate-600">
              6-Stage Full Interview Simulation - Real-world interview practice with AI evaluation
            </p>
          </div>

          {/* Progress Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-slate-600">
                {mockCompleted} interview{mockCompleted !== 1 ? 's' : ''} completed
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-slate-600">3 levels</span>
            </div>
          </div>

          {/* Level Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              🌱 Fresher
            </Badge>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              💼 Junior
            </Badge>
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              🚀 Senior
            </Badge>
          </div>

          {/* Features */}
          <div className="space-y-1 text-xs text-slate-600">
            <p>✓ 6-stage interview process</p>
            <p>✓ Voice & text interactions</p>
            <p>✓ Comprehensive evaluation report</p>
          </div>

          <Button asChild variant="outline" className="w-full group-hover:bg-purple-700 group-hover:text-white border-purple-300">
            <Link href="/dashboard/interviews/simulator">
              Start Mock Interview
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
