import { Suspense } from 'react';
import { Metadata } from 'next';
import {
  getChallengesWithProgress,
  getWeeklyChallenge,
  getUserChallengeStats,
  getInProgressChallenges,
  getCategoryStats,
  ChallengeFilters,
} from '@/app/actions/challenges';
import { getOfficeFundamentalsChallenges } from '@/app/actions/dashboard';
import { ChallengesFilters } from '@/components/challenges/challenges-filters';
import { ChallengesGrid } from '@/components/challenges/challenges-grid';
import { ChallengesPagination } from '@/components/challenges/challenges-pagination';
import { FeaturedChallengeCard } from '@/components/challenges/featured-challenge-card';
import { ContinueSection } from '@/components/challenges/continue-section';
import { CategoryCards } from '@/components/challenges/category-cards';
import { Badge } from '@/components/ui/badge';
import { Code2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Challenges | QodeBench',
  description: 'Master coding skills with real-world challenges',
};

interface ChallengesPageProps {
  searchParams: Promise<{
    search?: string;
    difficulty?: string;
    category?: string;
    status?: 'all' | 'not_started' | 'in_progress' | 'completed';
    sort?: 'newest' | 'popular' | 'points' | 'difficulty';
    page?: string;
  }>;
}

export default async function ChallengesPage({
  searchParams,
}: ChallengesPageProps) {
  // Parse search params
  const params = await searchParams;
  const filters: ChallengeFilters = {
    searchQuery: params.search,
    difficulty: params.difficulty,
    category: params.category,
    status: params.status || 'all',
    sort: params.sort || 'newest',
    page: parseInt(params.page || '1', 10),
  };

  // Check if we should show category cards (no filters active)
  const showCategoryCards = !filters.searchQuery &&
    !filters.difficulty &&
    !filters.category &&
    filters.status === 'all';

  // Fetch data in parallel
  const [challengesData, weeklyChallenge, userStats, inProgressChallenges, categoryStats, officeFundamentals] =
    await Promise.all([
      getChallengesWithProgress(filters, showCategoryCards), // Exclude office-fundamentals when showing category cards
      getWeeklyChallenge(),
      getUserChallengeStats(),
      getInProgressChallenges(),
      getCategoryStats(),
      getOfficeFundamentalsChallenges(),
    ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <Code2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Challenges</h1>
            <p className="text-slate-600">
              Master coding skills with real-world challenges
            </p>
          </div>
        </div>

        {/* User Stats */}
        <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <span className="font-semibold text-green-600">
                {userStats.completed}
              </span>
              <span className="mx-1 text-slate-400">/</span>
              <span className="text-slate-600">{userStats.total}</span>
              <span className="ml-1 text-slate-500">Completed</span>
            </Badge>
            {userStats.inProgress > 0 && (
              <Badge variant="outline" className="px-3 py-1 text-sm">
                <span className="font-semibold text-blue-600">
                  {userStats.inProgress}
                </span>
                <span className="ml-1 text-slate-500">In Progress</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Featured Weekly Challenge */}
        {weeklyChallenge && (
          <FeaturedChallengeCard challenge={weeklyChallenge} />
        )}

        {/* Continue Where You Left Off */}
        {inProgressChallenges.length > 0 && (
          <ContinueSection challenges={inProgressChallenges} />
        )}

        {/* Category Cards - Show only when no filters are active */}
        {showCategoryCards && (
          <CategoryCards
            stats={categoryStats}
            officeFundamentalsChallenges={officeFundamentals.challenges}
          />
        )}

        {/* Filters */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ChallengesFilters />
          </Suspense>
        </div>

        {/* All Challenges Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              All Challenges
            </h2>
            <p className="text-sm text-slate-600">
              {challengesData.total} challenge
              {challengesData.total !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Challenges Grid */}
          <ChallengesGrid challenges={challengesData.challenges} />

        {/* Pagination */}
        {challengesData.totalPages > 1 && (
          <div className="pt-4">
            <ChallengesPagination
              currentPage={challengesData.page}
              totalPages={challengesData.totalPages}
              total={challengesData.total}
              pageSize={challengesData.pageSize}
            />
          </div>
        )}
      </div>
    </div>
  );
}
