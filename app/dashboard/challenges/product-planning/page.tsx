import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, ChevronLeft, Clock, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product & Feature Planning | QodeBench',
  description: 'Product management, sprint planning, and WBS creation - Coming Soon',
};

export default function ProductPlanningPage() {
  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <Button asChild variant="ghost" size="sm" className="gap-2">
        <Link href="/dashboard/challenges">
          <ChevronLeft className="h-4 w-4" />
          Back to Categories
        </Link>
      </Button>

      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-lg bg-indigo-100 p-1.5 sm:p-2">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                🎯 Product & Feature Planning
              </h1>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                Coming Soon
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-slate-600">
              Product management, sprint planning, and WBS creation
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-2 border-indigo-200">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-white shadow-sm">
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Challenges Are Being Prepared
              </h2>
              <p className="text-sm text-slate-600">
                We're crafting comprehensive challenges to help you master product management
                and planning skills. Stay tuned!
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* What to Expect */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              What You'll Learn
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">
                    Sprint Planning & Estimation
                  </p>
                  <p className="text-sm text-slate-600">
                    Learn to break down features, estimate story points, and plan effective sprints
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">
                    Work Breakdown Structure (WBS)
                  </p>
                  <p className="text-sm text-slate-600">
                    Master the art of decomposing complex projects into manageable tasks
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">
                    Feature Prioritization
                  </p>
                  <p className="text-sm text-slate-600">
                    Learn frameworks like RICE, MoSCoW, and Kano model for effective prioritization
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">
                    Stakeholder Communication
                  </p>
                  <p className="text-sm text-slate-600">
                    Practice writing PRDs, user stories, and communicating technical decisions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">
                    Product Discovery & User Research
                  </p>
                  <p className="text-sm text-slate-600">
                    Learn to validate ideas, conduct user interviews, and analyze feedback
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notify Me (Future enhancement) */}
          <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4">
            <p className="text-sm text-indigo-900">
              💡 <strong>Tip:</strong> While you wait, explore our other challenge categories to
              strengthen your coding and engineering fundamentals. These skills will complement
              your product planning abilities!
            </p>
          </div>

          {/* CTA Button */}
          <Button asChild size="lg" className="w-full">
            <Link href="/dashboard/challenges">
              Explore Other Challenges
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
