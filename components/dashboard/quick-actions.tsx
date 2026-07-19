import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Lightbulb } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Continue Learning',
      description: 'Resume your learning modules',
      icon: BookOpen,
      href: '/dashboard/learning',
      buttonText: 'Start Learning',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Explore Courses',
      description: 'Browse all available courses',
      icon: GraduationCap,
      href: 'https://www.journeytoautomation.org/',
      buttonText: 'View Courses',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      external: true,
    },
    {
      title: 'Learning Resources',
      description: 'Access guides and tutorials',
      icon: Lightbulb,
      href: '/dashboard/learning',
      buttonText: 'Get Started',
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
                {action.external ? (
                  <Button asChild className="w-full">
                    <a href={action.href} target="_blank" rel="noopener noreferrer">{action.buttonText}</a>
                  </Button>
                ) : (
                  <Button asChild className="w-full">
                    <Link href={action.href}>{action.buttonText}</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
