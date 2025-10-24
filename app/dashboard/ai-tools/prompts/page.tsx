import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  Library,
  ArrowRight,
  Search,
  TrendingUp,
  Star,
  Copy,
  Bookmark,
  GitFork,
  Code,
  CheckCircle2,
  RefreshCw,
  FileText,
  TestTube2,
  Building2,
  BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Prompt Library | AI Tools Guide | QodeBench',
  description: 'Browse and fork battle-tested AI prompts for coding',
};

interface SearchParams {
  category?: string;
  search?: string;
  sort?: 'popular' | 'recent' | 'trending';
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  use_case: string;
  tech_stack: string[];
  ai_tools: string[];
  upvotes: number;
  usage_count: number;
  success_rate: number;
  tags: string[];
  created_at: string;
  is_featured: boolean;
  author_id: string;
  profiles?: {
    full_name: string | null;
  };
}

const categories = [
  { value: 'all', label: 'All Prompts', icon: Library },
  { value: 'code_generation', label: 'Code Generation', icon: Code },
  { value: 'debugging', label: 'Debugging', icon: Search },
  { value: 'code_review', label: 'Code Review', icon: CheckCircle2 },
  { value: 'refactoring', label: 'Refactoring', icon: RefreshCw },
  { value: 'documentation', label: 'Documentation', icon: FileText },
  { value: 'testing', label: 'Testing', icon: TestTube2 },
  { value: 'architecture', label: 'Architecture', icon: Building2 },
  { value: 'learning', label: 'Learning', icon: BookOpen },
];

async function getPrompts(params: SearchParams): Promise<Prompt[]> {
  const supabase = await createClient();

  let query = supabase
    .from('ai_prompts')
    .select(
      `
      *,
      profiles:author_id(full_name)
    `
    )
    .eq('is_public', true);

  // Filter by category
  if (params.category && params.category !== 'all') {
    query = query.eq('category', params.category);
  }

  // Search
  if (params.search) {
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%,tags.cs.{${params.search}}`
    );
  }

  // Sort
  switch (params.sort) {
    case 'popular':
      query = query.order('upvotes', { ascending: false });
      break;
    case 'recent':
      query = query.order('created_at', { ascending: false });
      break;
    case 'trending':
      // Simple trending: combine upvotes and usage_count
      query = query.order('usage_count', { ascending: false });
      break;
    default:
      query = query.order('upvotes', { ascending: false });
  }

  const { data, error } = await query.limit(50);

  if (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }

  return data || [];
}

async function getFeaturedPrompts(): Promise<Prompt[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_prompts')
    .select(
      `
      *,
      profiles:author_id(full_name)
    `
    )
    .eq('is_featured', true)
    .eq('is_public', true)
    .order('upvotes', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching featured prompts:', error);
    return [];
  }

  return data || [];
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    code_generation: 'bg-blue-100 text-blue-700',
    debugging: 'bg-red-100 text-red-700',
    code_review: 'bg-purple-100 text-purple-700',
    refactoring: 'bg-green-100 text-green-700',
    documentation: 'bg-yellow-100 text-yellow-700',
    testing: 'bg-pink-100 text-pink-700',
    architecture: 'bg-indigo-100 text-indigo-700',
    learning: 'bg-orange-100 text-orange-700',
    optimization: 'bg-teal-100 text-teal-700',
    security: 'bg-red-100 text-red-700',
  };
  return colors[category] || 'bg-slate-100 text-slate-700';
}

export default async function PromptsLibraryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const prompts = await getPrompts(params);
  const featuredPrompts = await getFeaturedPrompts();

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
            <div className="rounded-lg bg-purple-100 p-2">
              <Library className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Prompt Library</h1>
              <p className="text-slate-600">
                Battle-tested prompts for AI-powered development
              </p>
            </div>
          </div>
          <Link href="/dashboard/ai-tools/prompts/new">
            <Button>
              Create Prompt
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="font-semibold text-purple-600">{prompts.length}</span>
            <span className="ml-1 text-slate-500">Prompts</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="font-semibold text-blue-600">
              {prompts.reduce((sum, p) => sum + p.upvotes, 0)}
            </span>
            <span className="ml-1 text-slate-500">Total Upvotes</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="font-semibold text-green-600">
              {prompts.reduce((sum, p) => sum + p.usage_count, 0)}
            </span>
            <span className="ml-1 text-slate-500">Times Used</span>
          </Badge>
        </div>
      </div>

      {/* Featured Prompts */}
      {featuredPrompts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            <h2 className="text-xl font-semibold text-slate-900">Featured Prompts</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredPrompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="group border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge className={`${getCategoryColor(prompt.category)}`}>
                      {prompt.category.replace('_', ' ')}
                    </Badge>
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  </div>
                  <CardTitle className="text-lg">{prompt.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {prompt.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {prompt.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Copy className="h-4 w-4" />
                        {prompt.usage_count}
                      </span>
                    </div>
                    <Link href={`/dashboard/ai-tools/prompts/${prompt.id}`}>
                      <Button variant="outline" size="sm">
                        View
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search prompts by title, description, or tags..."
                className="pl-10"
                defaultValue={params.search}
              />
            </div>

            {/* Category Filter */}
            <Tabs defaultValue={params.category || 'all'}>
              <TabsList className="flex-wrap h-auto">
                {categories.slice(0, 5).map((cat) => (
                  <TabsTrigger key={cat.value} value={cat.value}>
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Prompts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">All Prompts</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Sort by:</span>
            <Tabs defaultValue={params.sort || 'popular'} className="w-auto">
              <TabsList>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge className={`${getCategoryColor(prompt.category)}`}>
                    {prompt.category.replace('_', ' ')}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {prompt.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {prompt.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tags */}
                {prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {prompt.upvotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Copy className="h-3 w-3" />
                      {prompt.usage_count}
                    </span>
                    {prompt.success_rate > 0 && (
                      <span className="flex items-center gap-1 text-green-600">
                        <Star className="h-3 w-3" />
                        {prompt.success_rate.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/dashboard/ai-tools/prompts/${prompt.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <GitFork className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {prompts.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
          <Library className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No prompts found</h3>
          <p className="mt-2 text-sm text-slate-600">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
