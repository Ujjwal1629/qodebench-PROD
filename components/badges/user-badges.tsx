'use client';

import { Badge } from '@/app/actions/badges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as BadgeUI } from '@/components/ui/badge';

interface UserBadgesProps {
  badges: Badge[];
}

export function UserBadges({ badges }: UserBadgesProps) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">{badge.metadata.icon}</div>
              <p className="font-semibold text-sm text-center text-slate-900">
                {badge.metadata.title}
              </p>
              <p className="text-xs text-slate-600 text-center mt-1">
                {badge.metadata.description}
              </p>
              <BadgeUI variant="secondary" className="mt-2 text-xs">
                {new Date(badge.earned_at).toLocaleDateString()}
              </BadgeUI>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
