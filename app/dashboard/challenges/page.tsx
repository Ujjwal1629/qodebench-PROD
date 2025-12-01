import { Metadata } from 'next';
import Link from 'next/link';
import { getTierProgress } from '@/app/actions/challenges';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code2, ArrowRight, Lock, Briefcase, Target, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Challenges | QodeBench',
  description: 'Master full-stack web development through practical challenges',
};

export default async function ChallengesPage() {
  // Fetch tier progress for stats
  const tierProgress = await getTierProgress();

  // Calculate total stats
  const totalCompleted = tierProgress.reduce((sum, tier) => sum + tier.completed, 0);
  const totalChallenges = tierProgress.reduce((sum, tier) => sum + tier.total, 0);

  // Get individual tier stats for category tiles
  const beginnerTier = tierProgress.find((t) => t.tier === 'beginner');
  const intermediateTier = tierProgress.find((t) => t.tier === 'intermediate');
  const softwareEngTier = tierProgress.find((t) => t.tier === 'software-engineering-essentials');
  const productPlanningTier = tierProgress.find((t) => t.tier === 'product-planning');
  const advancedTier = tierProgress.find((t) => t.tier === 'advanced');

  const practicalCompleted = (beginnerTier?.completed || 0) + (intermediateTier?.completed || 0);
  const practicalTotal = (beginnerTier?.total || 0) + (intermediateTier?.total || 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-3 text-center sm:text-left">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg">
            <Code2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Challenges</h1>
            <p className="text-sm sm:text-base text-slate-600">
              Master full-stack web development through practical challenges
            </p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="font-semibold text-green-600">{totalCompleted}</span>
            <span className="mx-1 text-slate-400">/</span>
            <span className="text-slate-600">{totalChallenges}</span>
            <span className="ml-1 text-slate-500">Completed</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <span className="text-slate-600">4 Categories Available</span>
          </Badge>
          <Badge variant="default" className="px-3 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-600">
            <span className="text-white">🎯 New Challenges Every Week</span>
          </Badge>
        </div>
      </div>

      {/* Learning Path Info */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-4 sm:p-5 md:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
          Choose Your Challenge Path
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          Select a category below to explore challenges that match your learning goals. From
          foundational coding skills to advanced real-world simulations, we've organized
          challenges to guide your growth as a software engineer.
        </p>
      </div>

      {/* Category Tiles */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Challenge Categories</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Category 1: Practical Coding Challenges */}
          <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group overflow-visible">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-t-xl">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <Badge variant="outline" className="bg-white">
                  {practicalTotal} Challenges
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Practical Coding Challenges
                </h3>
                <p className="text-sm text-slate-600">
                  Master coding fundamentals through beginner to intermediate challenges
                </p>
              </div>

              {/* Progress Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-slate-600">
                    {practicalCompleted} completed
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-slate-600">2 tiers</span>
                </div>
              </div>

              {/* Tier Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Beginner
                </Badge>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  Intermediate
                </Badge>
              </div>

              {/* Features */}
              <div className="space-y-1 text-xs text-slate-600">
                <p>✓ Variables, loops & functions</p>
                <p>✓ Data structures & algorithms</p>
                <p>✓ Real-world bug fixing</p>
              </div>

              <Button asChild className="w-full group-hover:bg-blue-700">
                <Link href="/dashboard/challenges/practical">
                  Explore Challenges
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Category 2: Software Engineering Essentials */}
          <Card className="border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300 group overflow-visible">
            <CardHeader className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-t-xl">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg group-hover:scale-110 transition-transform">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <Badge variant="outline" className="bg-white">
                  {softwareEngTier?.total || 0} Challenges
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Software Engineering Essentials
                </h3>
                <p className="text-sm text-slate-600">
                  Professional workflow practices and office fundamentals
                </p>
              </div>

              {/* Progress Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-slate-600">
                    {softwareEngTier?.completed || 0} completed
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-slate-600">1 tier</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1 text-xs text-slate-600">
                <p>✓ Git workflows & code reviews</p>
                <p>✓ Merge conflict resolution</p>
                <p>✓ Professional communication</p>
              </div>

              <Button asChild variant="outline" className="w-full group-hover:bg-orange-700 group-hover:text-white border-orange-300">
                <Link href="/dashboard/challenges/software-engineering-essentials">
                  Explore Challenges
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Category 3: Product & Feature Planning */}
          <Card className="border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 group overflow-visible">
            <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-t-xl">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <Badge variant="outline" className="bg-white">
                  {productPlanningTier?.total || 15} Challenges
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Product & Feature Planning
                </h3>
                <p className="text-sm text-slate-600">
                  Product management, sprint planning, and WBS creation
                </p>
              </div>

              {/* Progress Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-slate-600">
                    {productPlanningTier?.completed || 0} completed
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="text-slate-600">1 tier</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1 text-xs text-slate-600">
                <p>✓ Sprint planning & estimation</p>
                <p>✓ Work breakdown structures</p>
                <p>✓ Feature prioritization</p>
              </div>

              <Button asChild variant="outline" className="w-full group-hover:bg-indigo-700 group-hover:text-white border-indigo-300">
                <Link href="/dashboard/challenges/product-planning">
                  Explore Challenges
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advanced Challenges Section (Separate highlight) */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Elite Level</h2>

        <Card className="border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 group overflow-visible">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left side - Info */}
            <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-tl-xl">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {advancedTier?.total || 0} Challenges
                  </Badge>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Advanced Challenges
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Full simulations and real-world scenarios for senior developers
                  </p>

                  <div className="space-y-2 text-sm text-slate-700">
                    <p className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Complex debugging & system architecture</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Performance optimization at scale</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>End-to-end feature development</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Right side - Stats & CTA */}
            <CardContent className="flex flex-col justify-between pt-6 md:pt-8">
              <div className="space-y-4">
                {/* Progress */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-slate-600">
                      {advancedTier?.completed || 0} completed
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-slate-600">1 tier</span>
                  </div>
                </div>

                {/* Premium Note */}
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <p className="text-xs text-amber-800 flex items-start gap-2">
                    <Lock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Premium:</strong> Only first 2 challenges free for trial users
                    </span>
                  </p>
                </div>
              </div>

              <Button asChild size="lg" className="w-full mt-6 group-hover:bg-purple-700">
                <Link href="/dashboard/challenges/advanced">
                  Take on Advanced Challenges
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
