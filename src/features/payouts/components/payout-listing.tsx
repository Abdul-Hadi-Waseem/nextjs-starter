import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { payoutsQueryOptions } from '../api/queries';
import { payoutsSearchParamsCache } from '../lib/search-params-cache';
import { toPayoutFilters } from '../lib/search-params';
import { PayoutTable } from './payout-tables';

// Starts the list request on the server and streams it to the client table,
// which reads the same query (same filters → same key) with useSuspenseQuery.
export function PayoutListing() {
  const filters = toPayoutFilters(payoutsSearchParamsCache.all());
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(payoutsQueryOptions(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PayoutTable />
    </HydrationBoundary>
  );
}
