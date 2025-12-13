import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  iconClassName?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className,
  iconClassName,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className="flex items-center gap-1 text-sm">
              <span
                className={cn(
                  'font-medium',
                  trend === 'up' && 'text-success',
                  trend === 'down' && 'text-destructive',
                  trend === 'neutral' && 'text-muted-foreground'
                )}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'rounded-lg p-3 transition-transform duration-300 group-hover:scale-110',
            iconClassName || 'bg-primary/10'
          )}
        >
          <Icon className={cn('h-6 w-6', iconClassName ? 'text-primary-foreground' : 'text-primary')} />
        </div>
      </div>
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
    </div>
  );
}
