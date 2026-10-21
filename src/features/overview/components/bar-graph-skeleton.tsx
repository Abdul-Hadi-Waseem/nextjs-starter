import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CHART_PLOT_HEIGHT } from '../constants/chart';
import { BarGraphHeader } from './chart-headers';

const BAR_HEIGHTS = [45, 70, 35, 85, 55, 95, 40, 75, 60, 30, 80, 50];

export function BarGraphSkeleton() {
  return (
    <Card>
      <BarGraphHeader />
      <CardContent>
        <div className={`flex w-full items-end justify-around gap-2 pt-8 ${CHART_PLOT_HEIGHT}`}>
          {BAR_HEIGHTS.map((height, i) => (
            <Skeleton key={i} className='w-full rounded-t-sm' style={{ height: `${height}%` }} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
