import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CHART_PLOT_HEIGHT } from '../constants/chart';
import { PieGraphHeader } from './chart-headers';

export function PieGraphSkeleton() {
  return (
    <Card className='flex h-full flex-col'>
      <PieGraphHeader />
      <CardContent className='flex flex-1 items-center justify-center pb-0'>
        <div className={`flex aspect-square items-center justify-center ${CHART_PLOT_HEIGHT}`}>
          <Skeleton className='size-[85%] rounded-full' />
        </div>
      </CardContent>
    </Card>
  );
}
