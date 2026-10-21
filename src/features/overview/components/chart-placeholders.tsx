import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CHART_PLOT_HEIGHT } from '../constants/chart';

// Stand-ins for a chart's plot area, at the plot's fixed height.

/** Plot placeholder: the lazy chart's fallback and the body of each chart skeleton */
export function ChartPlotSkeleton({
  heightClassName = CHART_PLOT_HEIGHT
}: {
  heightClassName?: string;
}) {
  return (
    <div className={cn('relative w-full', heightClassName)}>
      <Skeleton className='bg-muted/40 absolute inset-0 rounded-lg' />
      <Skeleton className='absolute right-0 bottom-0 left-0 h-px' />
    </div>
  );
}

/** Takes the plot's place when there's nothing to draw, at the plot's height */
export function ChartEmpty({
  message,
  heightClassName = CHART_PLOT_HEIGHT
}: {
  message: string;
  heightClassName?: string;
}) {
  return (
    <div
      className={cn(
        'text-muted-foreground flex items-center justify-center rounded-lg border border-dashed px-6 text-center text-sm',
        heightClassName
      )}
    >
      {message}
    </div>
  );
}
