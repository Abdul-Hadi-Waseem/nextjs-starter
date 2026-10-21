import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getQueryClient } from '@/lib/query-client';
import { partnersQueryOptions } from '../api/queries';
import { partnersSearchParamsCache } from '../lib/search-params-cache';
import { toPartnerFilters } from '../lib/search-params';
import { PartnersTable } from './partners-table';

// Server component: starts the fetch without awaiting it and streams the pending query
// to the client, where PartnersTable picks it up with useSuspenseQuery.
export function PartnerListing() {
  const filters = toPartnerFilters(partnersSearchParamsCache.all());

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(partnersQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PartnersTable />
    </HydrationBoundary>
  );
}
