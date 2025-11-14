import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code2, Mic, Calendar } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Start a Challenge',
      description: 'Browse and solve coding challenges',
      icon: Code2,
      href: '/dashboard/challenges',
      buttonText: 'Browse Challenges',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Practice Interview',
      description: 'Sharpen your interview skills',
      icon: Mic,
      href: '/dashboard/interviews',
      buttonText: 'Start Interview',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: "This Week's Challenge",
      description: 'Compete in Code Friday',
      icon: Calendar,
      href: '/dashboard/challenges?weekly=true',
      buttonText: 'Join Challenge',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Card key={action.href} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg ${action.bgColor}`}>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${action.color}`} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">{action.title}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">{action.description}</p>
                </div>
                <Button asChild className="w-full">
                  <Link href={action.href}>{action.buttonText}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
