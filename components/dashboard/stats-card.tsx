import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  footer?: ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  footer,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{value}</p>
          </div>
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-brand-50">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-brand-600" />
          </div>
        </div>

        {change && (
          <div className="mt-4">
            <span
              className={cn(
                'text-sm font-medium',
                change.positive === false
                  ? 'text-red-600'
                  : 'text-green-600'
              )}
            >
              {change.positive === false ? '' : '+'}
              {change.value}
            </span>
            <span className="text-sm text-slate-600 ml-1">{change.label}</span>
          </div>
        )}

        {footer && <div className="mt-4">{footer}</div>}
      </CardContent>
    </Card>
  );
}
