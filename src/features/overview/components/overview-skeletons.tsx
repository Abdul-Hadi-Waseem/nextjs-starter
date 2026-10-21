import { Icons } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  PAYOUT_METHOD_LABEL,
  PAYOUT_STATUS_LABEL,
  payoutMethodOptions,
  payoutStatusOptions
} from '@/features/payouts/constants/payout-options';
import { PAYOUT_STATUS_STYLE } from '@/features/payouts/constants/payout-status-style';
import { DONUT_PLOT_HEIGHT, METHOD_CHART_COLOR } from '../constants/chart';
import {
  BREAKDOWN_CONTENT,
  LIST_ROW_GRID,
  RECENT_PAYOUTS_COUNT,
  RECENT_PAYOUT_ROW_HEIGHT,
  STATUS_ROW_HEIGHT
} from '../constants/layout';
import { OVERVIEW_SECTION } from '../constants/sections';
import { ChartCard } from './chart-card';
import { ChartPlotSkeleton } from './chart-placeholders';
import { ViewAllPayoutsLink } from './view-all-payouts-link';

// Skeletons render the same ChartCard (same header) and the fixed heights from
// constants, so the swap to real content doesn't move anything.

type ChartSection = (typeof OVERVIEW_SECTION)[keyof typeof OVERVIEW_SECTION];

/** Loading state of a section that is one chart (trend, growth, average, top partners) */
export function ChartSectionSkeleton({ section }: { section: ChartSection }) {
  return (
    <ChartCard {...section}>
      <ChartPlotSkeleton />
    </ChartCard>
  );
}

export function StatusBreakdownSkeleton() {
  return (
    <ChartCard {...OVERVIEW_SECTION.STATUS} contentClassName={BREAKDOWN_CONTENT}>
      <Skeleton className='h-lh w-48' />
      <Skeleton className='h-2 w-full rounded-full' />
      <ul>
        {payoutStatusOptions.map(({ value }) => {
          const Icon = Icons[PAYOUT_STATUS_STYLE[value].icon];
          return (
            <li key={value} className={cn(LIST_ROW_GRID, STATUS_ROW_HEIGHT)}>
              <span className='flex items-center gap-2'>
                <Icon className='text-muted-foreground size-4' aria-hidden='true' />
                {PAYOUT_STATUS_LABEL[value]}
              </span>
              <Skeleton className='h-lh w-16' />
              <Skeleton className='h-lh w-20 justify-self-end' />
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}

export function PayoutMethodsSkeleton() {
  return (
    <ChartCard {...OVERVIEW_SECTION.METHODS} contentClassName={BREAKDOWN_CONTENT}>
      <ChartPlotSkeleton heightClassName={DONUT_PLOT_HEIGHT} />
      <ul>
        {payoutMethodOptions.map(({ value }) => (
          <li key={value} className={cn(LIST_ROW_GRID, STATUS_ROW_HEIGHT)}>
            <span className='flex items-center gap-2'>
              <span
                aria-hidden='true'
                className='size-2.5 shrink-0 rounded-[2px]'
                style={{ backgroundColor: METHOD_CHART_COLOR[value] }}
              />
              {PAYOUT_METHOD_LABEL[value]}
            </span>
            <Skeleton className='h-lh w-24' />
            <Skeleton className='h-lh w-20 justify-self-end' />
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}

export function RecentPayoutsSkeleton() {
  return (
    <ChartCard {...OVERVIEW_SECTION.RECENT} action={<ViewAllPayoutsLink />}>
      <ul className='divide-y'>
        {Array.from({ length: RECENT_PAYOUTS_COUNT }, (_, index) => (
          <li key={index} className={cn(LIST_ROW_GRID, RECENT_PAYOUT_ROW_HEIGHT, 'px-2')}>
            <div className='flex flex-col gap-0.5'>
              <Skeleton className='h-lh w-36 text-sm' />
              <Skeleton className='h-lh w-28 text-xs' />
            </div>
            <Skeleton className='h-5 w-16 rounded-4xl' />
            <Skeleton className='h-lh w-20 justify-self-end text-sm' />
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
