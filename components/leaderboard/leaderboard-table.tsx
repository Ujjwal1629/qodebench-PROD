'use client';

import { LeaderboardUser } from '@/app/actions/leaderboard';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Flame } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserInitials } from '@/lib/utils/format';

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  isLoading?: boolean;
  onUserClick: (userId: string) => void;
}

export function LeaderboardTable({ users, isLoading, onUserClick }: LeaderboardTableProps) {
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

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <Card
          key={user.id}
          className={`cursor-pointer transition-all hover:shadow-md hover:border-blue-300 ${
            user.rank <= 3 ? 'border-2' : ''
          } ${
            user.rank === 1
              ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50'
              : user.rank === 2
              ? 'border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50'
              : user.rank === 3
              ? 'border-amber-600 bg-gradient-to-r from-amber-50 to-yellow-50'
              : ''
          }`}
          onClick={() => onUserClick(user.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex items-center justify-center w-12">
                {user.rank === 1 && <Trophy className="h-8 w-8 text-yellow-500" />}
                {user.rank === 2 && <Medal className="h-8 w-8 text-gray-400" />}
                {user.rank === 3 && <Award className="h-8 w-8 text-amber-600" />}
                {user.rank > 3 && (
                  <span className="text-2xl font-bold text-muted-foreground">
                    {user.rank}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar_url || undefined} alt={user.username} />
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  {getUserInitials(user.username, user.full_name)}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-lg truncate">{user.username}</p>
                  {user.experience_level && (
                    <Badge variant="outline" className="capitalize">
                      {user.experience_level}
                    </Badge>
                  )}
                </div>
                {user.full_name && (
                  <p className="text-sm text-muted-foreground truncate">{user.full_name}</p>
                )}
              </div>

              {/* Stats */}
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
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="text-2xl font-bold text-blue-600">
                  {user.points.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
