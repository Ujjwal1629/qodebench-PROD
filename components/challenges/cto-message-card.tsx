'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChallengeMarkdownRenderer } from '@/components/challenges/challenge-markdown-renderer';

interface CtoMessageCardProps {
  ctoName?: string;
  ctoRole?: string;
  message: string;
}

export function CtoMessageCard({
  ctoName = 'Sarah Chen',
  ctoRole = 'Chief Technology Officer',
  message,
}: CtoMessageCardProps) {
  // Generate initials from name
  const initials = ctoName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-start gap-4">
      {/* CTO Avatar */}
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
          {initials}
        </div>
      </div>

      {/* CTO Info + Message */}
      <div className="flex-1 min-w-0">
        <div className="mb-2">
          <h3 className="text-base font-semibold text-slate-900">{ctoName}</h3>
          <p className="text-sm text-slate-500">{ctoRole}</p>
        </div>

        {/* Message Bubble */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4">
            <ChallengeMarkdownRenderer content={message} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
