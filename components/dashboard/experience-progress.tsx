import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatPoints, getProgressPercentage } from '@/lib/utils/format';
import { getExperienceLevelByPoints } from '@/lib/constants/dashboard';
import { Map } from 'lucide-react';

interface ExperienceProgressProps {
  totalPoints: number;
}

export function ExperienceProgress({ totalPoints }: ExperienceProgressProps) {
  const currentLevel = getExperienceLevelByPoints(totalPoints);
  const progressPercentage = getProgressPercentage(
    totalPoints,
    currentLevel.minPoints,
    currentLevel.maxPoints
  );
  const pointsInLevel = totalPoints - currentLevel.minPoints;
  const pointsForLevel = currentLevel.maxPoints - currentLevel.minPoints;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Experience Progress
              </h3>
              <p className="text-sm text-slate-600">
                {currentLevel.description}
              </p>
            </div>
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm font-semibold"
              style={{ borderColor: currentLevel.color, color: currentLevel.color }}
            >
              {currentLevel.name}
            </Badge>
          </div>

          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">
                {formatPoints(pointsInLevel)} / {formatPoints(pointsForLevel)} points
              </span>
              <span className="font-medium text-slate-900">
                {progressPercentage}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-slate-600">
              {formatPoints(pointsForLevel - pointsInLevel)} points to next level
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/roadmap">
                <Map className="mr-2 h-4 w-4" />
                View Roadmap
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
