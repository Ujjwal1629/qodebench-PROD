import { Suspense } from 'react';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  BarChart3,
  Library,
  FlaskConical,
  GraduationCap,
  Construction,
  Info,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'AI Tools Guide | QodeBench',
  description: 'Master AI-powered development tools and 10x your productivity',
};

// Feature cards data
const features = [
  {
    title: 'Learning Paths',
    description: 'Structured courses to master AI tools from beginner to expert',
    icon: GraduationCap,
    href: '/dashboard/ai-tools/learn',
    color: 'bg-blue-100 text-blue-600',
    stats: 'Interactive Courses',
    available: false, // Coming after beta
  },
  {
    title: 'Prompt Library',
    description: 'Browse and fork 1000+ battle-tested AI prompts for coding',
    icon: Library,
    href: '/dashboard/ai-tools/prompts',
    color: 'bg-purple-100 text-purple-600',
    stats: 'Community Prompts',
    available: false, // Coming after beta
  },
  {
    title: 'Tool Comparison',
    description: 'Real-time benchmarks of Copilot, Cursor, ChatGPT, and more',
    icon: BarChart3,
    href: '/dashboard/ai-tools/compare',
    color: 'bg-green-100 text-green-600',
    stats: 'AI Tools Tracked',
    available: false, // Coming after beta
  },
  {
    title: 'Performance Sandbox',
    description: 'Test and compare AI tools side-by-side on real coding tasks',
    icon: FlaskConical,
    href: '/dashboard/ai-tools/sandbox',
    color: 'bg-orange-100 text-orange-600',
    stats: 'Live Playground',
    available: false, // Coming after beta
  },
  {
    title: 'Community Workflows',
    description: 'Real-world AI workflows shared by developers worldwide',
    icon: Users,
    href: '/dashboard/ai-tools/workflows',
    color: 'bg-indigo-100 text-indigo-600',
    stats: 'Shared Workflows',
    available: false, // Coming after beta
  },
  {
    title: 'AI Certifications',
    description: 'Earn industry-recognized credentials for AI tool proficiency',
    icon: Award,
    href: '/dashboard/ai-tools/certifications',
    color: 'bg-yellow-100 text-yellow-600',
    stats: 'Available Certifications',
    available: false, // Coming after beta
  },
];

// Benefits/stats to display
const benefits = [
  {
    label: 'Average Productivity Boost',
    value: '3-5x',
    description: 'Code faster with AI',
    icon: TrendingUp,
  },
  {
    label: 'Time Saved Weekly',
    value: '10+ hrs',
    description: 'Focus on complex problems',
    icon: Zap,
  },
  {
    label: 'Learning Curve',
    value: '2 weeks',
    description: 'From novice to proficient',
    icon: Target,
  },
];

async function getUserAIToolsStats() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      completedPaths: 0,
      savedPrompts: 0,
      savedWorkflows: 0,
      certificationsEarned: 0,
    };
  }

  // Fetch user stats in parallel
  const [completedPaths, savedPrompts, savedWorkflows, certificationsEarned] = await Promise.all([
    supabase
      .from('ai_learning_progress')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed'),
    supabase
      .from('ai_prompt_saves')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('ai_workflow_saves')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('ai_user_certifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ]);

  return {
    completedPaths: completedPaths.count || 0,
    savedPrompts: savedPrompts.count || 0,
    savedWorkflows: savedWorkflows.count || 0,
    certificationsEarned: certificationsEarned.count || 0,
  };
}

export default async function AIToolsPage() {
  const userStats = await getUserAIToolsStats();
  const hasProgress = Object.values(userStats).some(stat => stat > 0);

  return (
    <div className="space-y-8">
      {/* Under Development Banner */}
      <div className="rounded-lg border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-orange-100 p-2">
            <Construction className="h-6 w-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">Under Development</h3>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                Coming After Beta
              </Badge>
            </div>
            <p className="mt-2 text-sm text-slate-700">
              The AI Tools Guide is currently under active development. This comprehensive platform will help you master AI-powered development tools and boost your productivity. All features will be available after the beta period.
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <Info className="h-4 w-4" />
              <span>Stay tuned for updates on our upcoming features!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">AI Tools Guide</h1>
              <p className="text-slate-600">
                Master AI-powered development and 10x your productivity
              </p>
            </div>
          </div>
        </div>

        {/* User Progress Stats */}
        {hasProgress && (
          <div className="flex flex-wrap items-center gap-3">
            {userStats.completedPaths > 0 && (
              <Badge variant="outline" className="px-3 py-1 text-sm">
                <span className="font-semibold text-blue-600">
                  {userStats.completedPaths}
                </span>
                <span className="ml-1 text-slate-500">Paths Completed</span>
              </Badge>
            )}
            {userStats.savedPrompts > 0 && (
              <Badge variant="outline" className="px-3 py-1 text-sm">
                <span className="font-semibold text-purple-600">
                  {userStats.savedPrompts}
                </span>
                <span className="ml-1 text-slate-500">Prompts Saved</span>
              </Badge>
            )}
            {userStats.savedWorkflows > 0 && (
              <Badge variant="outline" className="px-3 py-1 text-sm">
                <span className="font-semibold text-indigo-600">
                  {userStats.savedWorkflows}
                </span>
                <span className="ml-1 text-slate-500">Workflows Saved</span>
              </Badge>
            )}
            {userStats.certificationsEarned > 0 && (
              <Badge variant="outline" className="px-3 py-1 text-sm">
                <span className="font-semibold text-yellow-600">
                  {userStats.certificationsEarned}
                </span>
                <span className="ml-1 text-slate-500">Certifications</span>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* What You'll Gain Section */}
      <div className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Why Master AI Tools?
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.label}
                className="rounded-lg bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-600">
                    {benefit.label}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {benefit.value}
                </div>
                <p className="text-sm text-slate-500">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Upcoming AI Tools Features
          </h2>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            Coming After Beta
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`rounded-lg p-2 ${feature.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {!feature.available && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                        After Beta
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      {feature.stats}
                    </span>
                    {feature.available ? (
                      <Link href={feature.href}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group-hover:translate-x-1 transition-transform"
                        >
                          Explore
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="ghost" size="sm" disabled className="text-orange-600">
                        After Beta
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Start Section - Disabled during beta */}
      {/* <div className="rounded-lg bg-white p-6 shadow-sm">
        ...Quick Start Guide content...
      </div> */}

      {/* Popular AI Tools Section - Disabled during beta */}
      {/* <div className="rounded-lg bg-white p-6 shadow-sm">
        ...Popular AI Developer Tools content...
      </div> */}
    </div>
  );
}
