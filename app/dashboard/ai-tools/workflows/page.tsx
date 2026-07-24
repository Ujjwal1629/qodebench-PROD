import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  Users,
  ArrowRight,
  TrendingUp,
  Clock,
  Bookmark,
  MessageCircle,
  Eye,
  Award,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Community Workflows | AI Tools Guide | QodeBench',
  description: 'Real-world AI workflows shared by developers worldwide',
};

interface Workflow {
  id: string;
  title: string;
  description: string;
  problem_statement: string;
  solution_overview: string;
  tools_used: string[];
  tech_stack: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_saved_minutes: number | null;
  upvotes: number;
  view_count: number;
  save_count: number;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  author_id: string;
  profiles?: {
    full_name: string | null;
  };
}

async function getWorkflows(): Promise<Workflow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_workflows')
    .select(
      `
      *,
      profiles:author_id(full_name)
    `
    )
    .eq('is_public', true)
    .order('upvotes', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching workflows:', error);
    return [];
  }

  return data || [];
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-700';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-700';
    case 'advanced':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export default async function WorkflowsPage() {
  const workflows = await getWorkflows();
  const featuredWorkflows = workflows.filter((w) => w.is_featured);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Link
        href="/dashboard/ai-tools"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
        Back to AI Tools
      </Link>

      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-2">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Community Workflows</h1>
              <p className="text-slate-600">
                Real-world AI workflows shared by developers
              </p>
            </div>
          </div>
          <Link href="/dashboard/ai-tools/workflows/new">
            <Button>
              Share Workflow
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="font-semibold text-indigo-600">{workflows.length}</span>
            <span className="ml-1 text-slate-500">Workflows</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="font-semibold text-blue-600">
              {workflows.reduce((sum, w) => sum + w.upvotes, 0)}
            </span>
            <span className="ml-1 text-slate-500">Total Upvotes</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="font-semibold text-green-600">
              {workflows
                .reduce((sum, w) => sum + (w.estimated_time_saved_minutes || 0), 0)
                .toLocaleString()}
            </span>
            <span className="ml-1 text-slate-500">Minutes Saved</span>
          </Badge>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg bg-indigo-50 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-indigo-100 p-2">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">
              Learn from Real Developers
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Discover how developers around the world use AI tools in their daily workflow.
              Each workflow includes the problem, solution, prompts used, and time saved.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Workflows */}
      {featuredWorkflows.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <h2 className="text-xl font-semibold text-slate-900">Featured Workflows</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredWorkflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="group border-2 border-yellow-200 bg-slate-50 hover:shadow-lg transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge className={getDifficultyColor(workflow.difficulty)}>
                      {workflow.difficulty}
                    </Badge>
                    <Award className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  </div>
                  <CardTitle className="text-lg">{workflow.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {workflow.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tools Used */}
                  <div>
                    <div className="text-xs font-medium text-slate-600 mb-2">Tools Used:</div>
                    <div className="flex flex-wrap gap-1">
                      {workflow.tools_used.map((tool) => (
                        <Badge key={tool} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {workflow.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {workflow.view_count}
                      </span>
                      {workflow.estimated_time_saved_minutes && (
                        <span className="flex items-center gap-1 text-green-600">
                          <Clock className="h-3 w-3" />
                          {workflow.estimated_time_saved_minutes}m saved
                        </span>
                      )}
                    </div>
                  </div>

                  <Link href={`/dashboard/ai-tools/workflows/${workflow.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Workflow
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Workflows */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">All Workflows</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge className={getDifficultyColor(workflow.difficulty)}>
                    {workflow.difficulty}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                  {workflow.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {workflow.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tools Used */}
                <div>
                  <div className="text-xs font-medium text-slate-600 mb-2">
                    Tools: {workflow.tools_used.slice(0, 2).join(', ')}
                    {workflow.tools_used.length > 2 && ` +${workflow.tools_used.length - 2}`}
                  </div>
                </div>

                {/* Tags */}
                {workflow.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {workflow.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {workflow.upvotes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {workflow.view_count}
                  </span>
                  {workflow.estimated_time_saved_minutes && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Clock className="h-3 w-3" />
                      {workflow.estimated_time_saved_minutes}m
                    </span>
                  )}
                </div>

                {/* Action */}
                <Link href={`/dashboard/ai-tools/workflows/${workflow.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {workflows.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No Workflows Yet
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Be the first to share your AI workflow with the community
          </p>
          <Link href="/dashboard/ai-tools/workflows/new">
            <Button className="mt-4">
              Share Your Workflow
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
