import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CHART_PLOT_HEIGHT } from '../constants/chart';
import { AreaGraphHeader } from './chart-headers';

export function AreaGraphSkeleton() {
  return (
    <Card>
      <AreaGraphHeader />
      <CardContent>
        <div className={`relative w-full ${CHART_PLOT_HEIGHT}`}>
          <div className='from-primary/5 to-primary/20 absolute inset-0 rounded-lg bg-linear-to-t' />
          <Skeleton className='absolute right-0 bottom-0 left-0 h-px' />
          <Skeleton className='absolute top-0 bottom-0 left-0 w-px' />
        </div>
      </CardContent>
    </Card>
  );
}
