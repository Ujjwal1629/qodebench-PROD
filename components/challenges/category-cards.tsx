'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Code2,
  Atom,
  FileCode,
  Server,
  ArrowRight,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface CategoryStat {
  category: string;
  total: number;
  completed: number;
  totalPoints: number;
}

interface OfficeFundamentalsChallenge {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  estimated_time: number | null;
  is_completed: boolean;
}

interface CategoryCardsProps {
  stats: CategoryStat[];
  officeFundamentalsChallenges?: OfficeFundamentalsChallenge[];
}

interface CategoryConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    id: 'office-fundamentals',
    name: 'Office Fundamentals',
    description: 'Master PR reviews, documentation, RFCs, and professional communication',
    icon: Briefcase,
    color: 'text-orange-600',
    bgColor: 'bg-gradient-to-br from-orange-50 to-white',
    borderColor: 'border-orange-200 hover:border-orange-300',
    iconBg: 'bg-orange-100',
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Data structures, algorithms, and Python-specific challenges',
    icon: Code2,
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-white',
    borderColor: 'border-blue-200 hover:border-blue-300',
    iconBg: 'bg-blue-100',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Modern JavaScript, ES6+, async patterns, and core concepts',
    icon: FileCode,
    color: 'text-yellow-600',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-white',
    borderColor: 'border-yellow-200 hover:border-yellow-300',
    iconBg: 'bg-yellow-100',
  },
  {
    id: 'react',
    name: 'React',
    description: 'Components, hooks, state management, and React best practices',
    icon: Atom,
    color: 'text-cyan-600',
    bgColor: 'bg-gradient-to-br from-cyan-50 to-white',
    borderColor: 'border-cyan-200 hover:border-cyan-300',
    iconBg: 'bg-cyan-100',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'Server components, routing, API routes, and Next.js features',
    icon: Code2,
    color: 'text-slate-700',
    bgColor: 'bg-gradient-to-br from-slate-50 to-white',
    borderColor: 'border-slate-200 hover:border-slate-300',
    iconBg: 'bg-slate-100',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Backend development, APIs, databases, and server-side logic',
    icon: Server,
    color: 'text-green-600',
    bgColor: 'bg-gradient-to-br from-green-50 to-white',
    borderColor: 'border-green-200 hover:border-green-300',
    iconBg: 'bg-green-100',
  },
];

export function CategoryCards({ stats, officeFundamentalsChallenges = [] }: CategoryCardsProps) {
  // Create a map of category stats for quick lookup
  const statsMap = new Map(stats.map(s => [s.category, s]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Choose a Category</h2>
        <p className="text-slate-600 mt-1">
          Select a category to explore challenges and sharpen your skills
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_CONFIGS.map((category) => {
          const stat = statsMap.get(category.id);
          const Icon = category.icon;
          const completionPercentage = stat && stat.total > 0
            ? Math.round((stat.completed / stat.total) * 100)
            : 0;
          const isComplete = stat && stat.completed === stat.total && stat.total > 0;

          // Special handling for Office Fundamentals - show full width with challenge list
          if (category.id === 'office-fundamentals' && officeFundamentalsChallenges.length > 0) {
            return (
              <div key={category.id} className="sm:col-span-2 lg:col-span-3">
                <Card
                  className={`${category.bgColor} ${category.borderColor} border-2 relative overflow-hidden`}
                >
                  {/* Decorative background icon */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5 -mr-8 -mt-8">
                    <Icon className="w-full h-full" />
                  </div>

                  <CardContent className="p-6 relative">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`${category.iconBg} p-3 rounded-lg`}>
                            <Icon className={`h-6 w-6 ${category.color}`} />
                          </div>
                          <div>
                            <h3 className={`text-xl font-semibold ${category.color}`}>
                              {category.name}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        {isComplete && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <Trophy className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Your Progress</span>
                          <span className={`font-semibold ${category.color}`}>
                            {stat?.completed || 0}/{stat?.total || 0} completed ({completionPercentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${category.color.replace('text-', 'bg-')} transition-all duration-500`}
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Challenges List */}
                      <div className="space-y-2">
                        {officeFundamentalsChallenges.map((challenge) => (
                          <Link
                            key={challenge.id}
                            href={`/dashboard/challenges/${challenge.slug}`}
                            className="block group"
                          >
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white border border-transparent hover:border-orange-200 transition-all">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Completion Status */}
                                {challenge.is_completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                ) : (
                                  <div className="h-5 w-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                                )}

                                {/* Challenge Title */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                                    {challenge.title}
                                  </h4>
                                </div>

                                {/* Challenge Meta */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      challenge.difficulty === 'easy'
                                        ? 'bg-green-50 text-green-700 border-green-200'
                                        : challenge.difficulty === 'medium'
                                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        : 'bg-red-50 text-red-700 border-red-200'
                                    }`}
                                  >
                                    {challenge.difficulty}
                                  </Badge>
                                  <span className="text-sm text-slate-600 font-medium">
                                    {challenge.points} pts
                                  </span>
                                  {challenge.estimated_time && (
                                    <span className="text-sm text-slate-500">
                                      {challenge.estimated_time} min
                                    </span>
                                  )}
                                  <ArrowRight className="h-4 w-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Total Points */}
                      <div className="flex items-center justify-between pt-2 border-t border-orange-200">
                        <span className="text-sm text-slate-600">Total Points Available</span>
                        <span className={`font-semibold ${category.color}`}>
                          {stat?.totalPoints || 0} points
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          }

          // Regular card rendering for other categories
          return (
            <Link
              key={category.id}
              href={`/dashboard/challenges?category=${category.id}`}
              className="block group"
            >
              <Card
                className={`${category.bgColor} ${category.borderColor} border-2 transition-all hover:shadow-lg relative overflow-hidden h-full`}
              >
                {/* Decorative background icon */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 -mr-8 -mt-8">
                  <Icon className="w-full h-full" />
                </div>

                <CardContent className="p-6 relative">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className={`${category.iconBg} p-3 rounded-lg`}>
                        <Icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      {isComplete && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <Trophy className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className={`text-lg font-semibold ${category.color} group-hover:underline`}>
                        {category.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    </div>

                    {/* Stats */}
                    {stat && stat.total > 0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Progress</span>
                          <span className={`font-semibold ${category.color}`}>
                            {stat.completed}/{stat.total} completed
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${category.color.replace('text-', 'bg-')} transition-all duration-500`}
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>

                        {/* Bottom Stats */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{stat.totalPoints} points</span>
                          </div>
                          <ArrowRight className={`h-4 w-4 ${category.color} group-hover:translate-x-1 transition-transform`} />
                        </div>
                      </div>
                    ) : (
                      <div className="pt-4 flex items-center justify-between">
                        <Badge variant="outline" className="text-slate-600">
                          Coming Soon
                        </Badge>
                        <ArrowRight className={`h-4 w-4 ${category.color} opacity-50`} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
