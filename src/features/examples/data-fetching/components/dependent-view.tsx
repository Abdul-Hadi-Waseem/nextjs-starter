import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { partnersQueryOptions } from '@/features/partners/api/queries';
import { payoutsQueryOptions } from '@/features/payouts/api/queries';
import { getQueryClient } from '@/lib/query-client';
import { PARTNER_PICKER_FILTERS, TOTALS_FILTERS } from '../../shared/constants/demo';
import { DependentQueries, DependentQueriesSkeleton } from './dependent-queries';
import { ParallelTotals, ParallelTotalsSkeleton } from './parallel-totals';

export function DependentView() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(partnersQueryOptions(PARTNER_PICKER_FILTERS));
  void queryClient.prefetchQuery(partnersQueryOptions(TOTALS_FILTERS));
  void queryClient.prefetchQuery(payoutsQueryOptions(TOTALS_FILTERS));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='grid gap-4'>
        <Suspense fallback={<ParallelTotalsSkeleton />}>
          <ParallelTotals />
        </Suspense>
        <Suspense fallback={<DependentQueriesSkeleton />}>
          <DependentQueries />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}

export function DependentSkeleton() {
  return (
    <div className='grid gap-4'>
      <ParallelTotalsSkeleton />
      <DependentQueriesSkeleton />
    </div>
  );
}
