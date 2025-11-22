'use client';

import { useState } from 'react';
import { LeaderboardUser } from '@/app/actions/leaderboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Flame, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserInitials } from '@/lib/utils/format';

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  isLoading?: boolean;
  onUserClick: (userId: string) => void;
  currentUserId?: string;
}

export function LeaderboardTable({ users, isLoading, onUserClick, currentUserId }: LeaderboardTableProps) {
  const [displayLimit, setDisplayLimit] = useState(20);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No users found</p>
        </CardContent>
      </Card>
    );
  }

  const displayedUsers = users.slice(0, displayLimit);
  const hasMore = users.length > displayLimit;

  // Check if current user is in displayed list
  const currentUserInDisplay = currentUserId && displayedUsers.some(u => u.id === currentUserId);
  const currentUserData = currentUserId && users.find(u => u.id === currentUserId);
  const shouldShowCurrentUser = currentUserId && !currentUserInDisplay && currentUserData;

  return (
    <div className="space-y-2">
      {displayedUsers.map((user) => (
        <Card
          key={user.id}
          className={`cursor-pointer transition-all hover:shadow-md hover:border-blue-300 ${
            user.id === currentUserId ? 'ring-2 ring-brand-500 border-brand-300' : ''
          } ${
            user.rank <= 3 ? 'border-2' : ''
          } ${
            user.rank === 1
              ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50'
              : user.rank === 2
              ? 'border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50'
              : user.rank === 3
              ? 'border-amber-600 bg-gradient-to-r from-amber-50 to-yellow-50'
              : user.id === currentUserId
              ? 'bg-brand-50'
              : ''
          }`}
          onClick={() => onUserClick(user.id)}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Rank */}
              <div className="flex items-center justify-center w-8 sm:w-12 flex-shrink-0">
                {user.rank === 1 && <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />}
                {user.rank === 2 && <Medal className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />}
                {user.rank === 3 && <Award className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />}
                {user.rank > 3 && (
                  <span className="text-lg sm:text-2xl font-bold text-muted-foreground">
                    {user.rank}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                <AvatarImage src={user.avatar_url || undefined} alt={user.username} />
                <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm sm:text-base">
                  {getUserInitials(user.username, user.full_name)}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                  <p className="font-semibold text-sm sm:text-lg truncate">{user.username}</p>
                  {user.experience_level && (
                    <Badge variant="outline" className="capitalize text-[10px] sm:text-xs py-0 px-1 sm:px-2">
                      {user.experience_level}
                    </Badge>
                  )}
                </div>
                {user.full_name && (
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.full_name}</p>
                )}
              </div>

              {/* Stats - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-6 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Challenges</p>
                  <p className="text-lg font-bold">{user.challenges_completed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <p className="text-lg font-bold">{user.current_streak}</p>
                  </div>
                </div>
              </div>

              {/* Points */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Points</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">
                  {user.points.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Show current user if not in displayed list */}
      {shouldShowCurrentUser && currentUserData && (
        <>
          <div className="flex items-center justify-center py-2">
            <div className="flex-1 border-t border-slate-300"></div>
            <span className="px-4 text-sm text-slate-500 font-medium">Your Position</span>
            <div className="flex-1 border-t border-slate-300"></div>
          </div>
          <Card
            className="cursor-pointer transition-all hover:shadow-md ring-2 ring-brand-500 border-brand-300 bg-brand-50"
            onClick={() => onUserClick(currentUserData.id)}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-8 sm:w-12 flex-shrink-0">
                  <span className="text-lg sm:text-2xl font-bold text-brand-600">
                    {currentUserData.rank}
                  </span>
                </div>

                {/* Avatar */}
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  <AvatarImage src={currentUserData.avatar_url || undefined} alt={currentUserData.username} />
                  <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm sm:text-base">
                    {getUserInitials(currentUserData.username, currentUserData.full_name)}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                    <p className="font-semibold text-sm sm:text-lg truncate">{currentUserData.username}</p>
                    {currentUserData.experience_level && (
                      <Badge variant="outline" className="capitalize text-[10px] sm:text-xs py-0 px-1 sm:px-2">
                        {currentUserData.experience_level}
                      </Badge>
                    )}
                    <Badge className="bg-brand-600 text-white text-[10px] sm:text-xs py-0 px-1 sm:px-2">You</Badge>
                  </div>
                  {currentUserData.full_name && (
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{currentUserData.full_name}</p>
                  )}
                </div>

                {/* Stats - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-6 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Challenges</p>
                    <p className="text-lg font-bold">{currentUserData.challenges_completed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <p className="text-lg font-bold">{currentUserData.current_streak}</p>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Points</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">
                    {currentUserData.points.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => setDisplayLimit(prev => prev + 20)}
            variant="outline"
            className="gap-2"
          >
            <ChevronDown className="h-4 w-4" />
            Load More ({users.length - displayLimit} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}
