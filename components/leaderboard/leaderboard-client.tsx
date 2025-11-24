'use client';

import { useState, useEffect } from 'react';
import { LeaderboardUser, UserRank } from '@/app/actions/leaderboard';
import { LeaderboardTabs } from './leaderboard-tabs';
import { LeaderboardTable } from './leaderboard-table';
import { CurrentUserRank } from './current-user-rank';
import { UserProfileModal } from './user-profile-modal';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { searchUsers } from '@/app/actions/leaderboard';
import { useDebounce } from '@/hooks/use-debounce';
import { createClient } from '@/lib/supabase/client';

type LeaderboardType = 'all-time' | 'weekly';

interface LeaderboardClientProps {
  initialAllTimeData: LeaderboardUser[];
  initialWeeklyData: LeaderboardUser[];
  initialUserRank: UserRank | null;
}

export function LeaderboardClient({
  initialAllTimeData,
  initialWeeklyData,
  initialUserRank,
}: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('all-time');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LeaderboardUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearch.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const results = await searchUsers(debouncedSearch, activeTab);
      setSearchResults(results);
      setIsSearching(false);
    };

    performSearch();
  }, [debouncedSearch, activeTab]);

  const displayData = searchQuery.trim().length >= 2
    ? searchResults
    : activeTab === 'all-time'
    ? initialAllTimeData
    : initialWeeklyData;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <LeaderboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Current User Rank */}
      {initialUserRank && (
        <CurrentUserRank
          rank={initialUserRank.rank}
          totalUsers={initialUserRank.total_users}
          percentile={initialUserRank.percentile}
          points={initialUserRank.points}
        />
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search users by username or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Leaderboard Table */}
      <LeaderboardTable
        users={displayData}
        isLoading={isSearching}
        onUserClick={(userId) => setSelectedUserId(userId)}
        currentUserId={currentUserId || undefined}
      />

      {/* User Profile Modal */}
      {selectedUserId && (
        <UserProfileModal
          userId={selectedUserId}
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}
