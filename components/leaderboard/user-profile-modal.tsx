'use client';

import { useEffect, useState } from 'react';
import { getUserProfile } from '@/app/actions/leaderboard';
import { getUserBadges, Badge as BadgeType } from '@/app/actions/badges';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Target, Flame, Calendar } from 'lucide-react';

interface UserProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ userId, isOpen, onClose }: UserProfileModalProps) {
  const [profileData, setProfileData] = useState<any>(null);
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const [data, userBadges] = await Promise.all([
        getUserProfile(userId),
        getUserBadges(userId),
      ]);
      setProfileData(data);
      setBadges(userBadges);
      setIsLoading(false);
    };

    if (isOpen && userId) {
      fetchProfile();
    }
  }, [userId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">User Profile</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <ProfileSkeleton />
        ) : profileData ? (
          <ProfileContent data={profileData} badges={badges} />
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Failed to load profile</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ProfileContent({ data, badges }: { data: any; badges: BadgeType[] }) {
  const { profile, categoryCounts, recentActivity } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
            <AvatarFallback className="bg-blue-600 text-white text-2xl font-semibold">
              {profile.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile.username}</h2>
            {profile.full_name && (
              <p className="text-muted-foreground">{profile.full_name}</p>
            )}
            {profile.experience_level && (
              <Badge variant="outline" className="mt-2 capitalize">
                {profile.experience_level}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Trophy className="h-5 w-5 text-blue-600" />}
            label="Total Points"
            value={profile.total_points.toLocaleString()}
          />
          <StatCard
            icon={<Target className="h-5 w-5 text-green-600" />}
            label="Completed"
            value={profile.challenges_completed}
          />
          <StatCard
            icon={<Flame className="h-5 w-5 text-orange-500" />}
            label="Current Streak"
            value={profile.current_streak}
          />
          <StatCard
            icon={<Flame className="h-5 w-5 text-red-600" />}
            label="Longest Streak"
            value={profile.longest_streak}
          />
        </div>

        {/* Category Breakdown */}
        {Object.keys(categoryCounts).length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Challenges by Category</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(categoryCounts).map(([category, count]) => (
                <div
                  key={category}
                  className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border"
                >
                  <span className="capitalize text-sm">{category}</span>
                  <Badge variant="secondary">{count as number}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden for beta - Badges/Achievements */}
        {/* {badges.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Achievements ({badges.length})</h3>
            <div className="grid grid-cols-3 gap-2">
              {badges.slice(0, 6).map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-2 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200"
                  title={badge.metadata.description}
                >
                  <div className="text-2xl mb-1">{badge.metadata.icon}</div>
                  <p className="text-xs font-medium text-center leading-tight">
                    {badge.metadata.title}
                  </p>
                </div>
              ))}
            </div>
            {badges.length > 6 && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                +{badges.length - 6} more
              </p>
            )}
          </div>
        )} */}

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {recentActivity.slice(0, 5).map((activity: any) => (
                <div
                  key={activity.challenge_id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border"
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">Completed a challenge</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="p-4 rounded-lg bg-slate-50 border">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}
