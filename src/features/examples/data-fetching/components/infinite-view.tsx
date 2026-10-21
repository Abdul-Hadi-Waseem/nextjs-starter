import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getQueryClient } from '@/lib/query-client';
import { EXAMPLE_COLUMN } from '../../shared/constants/layout';
import { payoutsInfiniteQueryOptions } from '../../shared/api/queries';
import { InfinitePayouts, InfinitePayoutsSkeleton } from './infinite-payouts';

export function InfiniteView() {
  const queryClient = getQueryClient();
  // Prefetches the first page only; later pages load in the browser.
  void queryClient.prefetchInfiniteQuery(payoutsInfiniteQueryOptions());

  return (
    <div className={EXAMPLE_COLUMN}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<InfinitePayoutsSkeleton />}>
          <InfinitePayouts />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}

export function InfiniteSkeleton() {
  return (
    <div className={EXAMPLE_COLUMN}>
      <InfinitePayoutsSkeleton />
    </div>
  );
}
