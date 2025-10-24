import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  BarChart3,
  ArrowRight,
  CheckCircle2,
  X,
  DollarSign,
  Code,
  Zap,
  Brain,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const metadata: Metadata = {
  title: 'AI Tools Comparison | AI Tools Guide | QodeBench',
  description: 'Compare AI developer tools side-by-side',
};

interface AITool {
  id: string;
  name: string;
  display_name: string;
  category: string;
  description: string;
  pricing_model: string;
  pricing_details: any;
  features: string[];
  supported_languages: string[];
  supported_ides: string[];
  pros: string[];
  cons: string[];
  logo_url: string | null;
}

async function getAITools(): Promise<AITool[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ai_tools_catalog')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching AI tools:', error);
    return [];
  }

  return data || [];
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'code_completion':
      return Code;
    case 'chat_assistant':
      return Brain;
    case 'code_generation':
      return Zap;
    default:
      return Code;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'code_completion':
      return 'bg-blue-100 text-blue-700';
    case 'chat_assistant':
      return 'bg-purple-100 text-purple-700';
    case 'code_generation':
      return 'bg-green-100 text-green-700';
    case 'ide_integration':
      return 'bg-yellow-100 text-yellow-700';
    case 'pair_programming':
      return 'bg-indigo-100 text-indigo-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export default async function CompareToolsPage() {
  const tools = await getAITools();

  // Group tools by category
  const toolsByCategory = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, AITool[]>);

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
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-100 p-2">
            <BarChart3 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">AI Tools Comparison</h1>
            <p className="text-slate-600">
              Compare features, pricing, and capabilities of popular AI developer tools
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="font-semibold text-green-600">{tools.length}</span>
            <span className="ml-1 text-slate-500">Tools Tracked</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="font-semibold text-blue-600">
              {Object.keys(toolsByCategory).length}
            </span>
            <span className="ml-1 text-slate-500">Categories</span>
          </Badge>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg bg-green-50 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-green-100 p-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Find Your Perfect AI Tool</h3>
            <p className="mt-1 text-sm text-slate-600">
              Compare features, pricing, and capabilities to choose the right AI tools for your
              workflow. Updated regularly with the latest information.
            </p>
          </div>
        </div>
      </div>

      {/* Tools by Category */}
      {Object.entries(toolsByCategory).map(([category, categoryTools]) => {
        const Icon = getCategoryIcon(category);

        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${getCategoryColor(category)}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                {category.replace('_', ' ').toUpperCase()}
              </h2>
            </div>

            {/* Quick Comparison Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <Card key={tool.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{tool.display_name}</CardTitle>
                        <Badge
                          variant="outline"
                          className={`mt-2 ${getCategoryColor(tool.category)}`}
                        >
                          {tool.category.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Pricing */}
                    <div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-900">
                          {tool.pricing_model}
                        </span>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div>
                      <div className="text-xs font-medium text-slate-600 mb-2">
                        Key Features:
                      </div>
                      <ul className="space-y-1">
                        {tool.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-600" />
                            <span className="text-slate-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Supported Languages */}
                    <div>
                      <div className="text-xs font-medium text-slate-600 mb-2">
                        Languages: {tool.supported_languages.slice(0, 3).join(', ')}
                        {tool.supported_languages.length > 3 &&
                          ` +${tool.supported_languages.length - 3}`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
                <CardDescription>
                  Compare all features side-by-side
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature</TableHead>
                        {categoryTools.map((tool) => (
                          <TableHead key={tool.id}>{tool.display_name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Pricing Model</TableCell>
                        {categoryTools.map((tool) => (
                          <TableCell key={tool.id}>{tool.pricing_model}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Code Completion</TableCell>
                        {categoryTools.map((tool) => (
                          <TableCell key={tool.id}>
                            {tool.features.some((f) =>
                              f.toLowerCase().includes('completion')
                            ) ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <X className="h-5 w-5 text-slate-300" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Chat Interface</TableCell>
                        {categoryTools.map((tool) => (
                          <TableCell key={tool.id}>
                            {tool.features.some(
                              (f) =>
                                f.toLowerCase().includes('chat') ||
                                f.toLowerCase().includes('conversation')
                            ) ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <X className="h-5 w-5 text-slate-300" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Multi-language Support</TableCell>
                        {categoryTools.map((tool) => (
                          <TableCell key={tool.id}>
                            {tool.supported_languages.length > 5 ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <X className="h-5 w-5 text-slate-300" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">IDE Integration</TableCell>
                        {categoryTools.map((tool) => (
                          <TableCell key={tool.id}>
                            {tool.supported_ides.length > 0 ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <X className="h-5 w-5 text-slate-300" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Pros and Cons */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <Card key={`${tool.id}-proscons`} className="bg-slate-50">
                  <CardHeader>
                    <CardTitle className="text-lg">{tool.display_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Pros */}
                    <div>
                      <div className="mb-2 text-sm font-semibold text-green-700">Pros</div>
                      <ul className="space-y-1">
                        {tool.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-600" />
                            <span className="text-slate-700">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div>
                      <div className="mb-2 text-sm font-semibold text-red-700">Cons</div>
                      <ul className="space-y-1">
                        {tool.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs">
                            <X className="mt-0.5 h-3 w-3 flex-shrink-0 text-red-600" />
                            <span className="text-slate-700">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {tools.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No Tools to Compare Yet
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            AI tools comparison data is being prepared
          </p>
        </div>
      )}

      {/* CTA */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              Try Tools in the Sandbox
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Test these AI tools side-by-side with real coding tasks
            </p>
            <Link href="/dashboard/ai-tools/sandbox">
              <Button className="mt-4">
                Go to Sandbox
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
