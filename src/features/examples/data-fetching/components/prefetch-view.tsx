import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { partnersQueryOptions } from '@/features/partners/api/queries';
import { getQueryClient } from '@/lib/query-client';
import { PARTNER_PICKER_FILTERS } from '../../shared/constants/demo';
import { PrefetchPartners, PrefetchPartnersSkeleton } from './prefetch-partners';

export function PrefetchView() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(partnersQueryOptions(PARTNER_PICKER_FILTERS));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PrefetchPartnersSkeleton />}>
        <PrefetchPartners />
      </Suspense>
    </HydrationBoundary>
  );
}
