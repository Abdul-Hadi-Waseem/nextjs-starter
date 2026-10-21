import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { EXAMPLE_COLUMN } from '../../shared/constants/layout';
import { partnersQueryOptions } from '@/features/partners/api/queries';
import { EXAMPLE_PAGE_SIZE } from '../../shared/constants/demo';
import { paginationSearchParamsCache } from '../lib/search-params';
import { PaginatedPartners, PaginatedPartnersSkeleton } from './paginated-partners';

export function PaginationView() {
  const page = paginationSearchParamsCache.get('page');
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(partnersQueryOptions({ page, limit: EXAMPLE_PAGE_SIZE }));

  return (
    <div className={EXAMPLE_COLUMN}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PaginatedPartners />
      </HydrationBoundary>
    </div>
  );
}

export function PaginationSkeleton() {
  return (
    <div className={EXAMPLE_COLUMN}>
      <PaginatedPartnersSkeleton />
    </div>
  );
}
