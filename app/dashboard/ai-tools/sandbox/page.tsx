import { Metadata } from 'next';
import Link from 'next/link';
import { FlaskConical, ArrowRight, Zap, Code, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'AI Tools Sandbox | AI Tools Guide | QodeBench',
  description: 'Test and compare AI tools side-by-side with real coding tasks',
};

export default function SandboxPage() {
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
          <div className="rounded-lg bg-orange-100 p-2">
            <FlaskConical className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">AI Tools Sandbox</h1>
            <p className="text-slate-600">
              Test and compare AI tools side-by-side with real coding tasks
            </p>
          </div>
        </div>

        <Badge variant="secondary" className="text-sm">
          Coming Soon
        </Badge>
      </div>

      {/* Feature Preview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="rounded-lg bg-blue-100 p-2 w-fit">
              <Code className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Side-by-Side Testing</CardTitle>
            <CardDescription>
              Run the same prompt across multiple AI tools simultaneously
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="rounded-lg bg-purple-100 p-2 w-fit">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Real-Time Metrics</CardTitle>
            <CardDescription>
              Compare response time, code quality, and token usage
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="rounded-lg bg-green-100 p-2 w-fit">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-lg">Instant Results</CardTitle>
            <CardDescription>
              See which AI tool works best for your specific use case
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Coming Soon Message */}
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <FlaskConical className="mx-auto h-16 w-16 text-orange-600" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Sandbox Coming Soon
              </h3>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
                The AI Tools Sandbox is currently under development. Soon you'll be able to test
                and compare different AI tools side-by-side with real coding tasks, measure
                performance metrics, and find the perfect tool for your workflow.
              </p>
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">
                What you'll be able to do:
              </h4>
              <div className="grid gap-3 text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-3 text-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
                    1
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Submit a coding task</span>
                    <p className="text-slate-600">
                      Enter a prompt or coding challenge you want AI tools to solve
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
                    2
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Select tools to compare</span>
                    <p className="text-slate-600">
                      Choose from Copilot, Cursor, ChatGPT, Claude, and more
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
                    3
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">View results</span>
                    <p className="text-slate-600">
                      Compare outputs, speed, quality scores, and cost estimates
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
                    4
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Save benchmarks</span>
                    <p className="text-slate-600">
                      Track your comparisons and build your personal AI tool insights
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/dashboard/ai-tools">
                <Button variant="outline">
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  Explore Other Features
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
