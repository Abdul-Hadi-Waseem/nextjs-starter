'use client';

import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { useEffect } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { partnersQueryOptions } from '@/features/partners/api/queries';
import { pageCount } from '@/lib/pagination';
import { cn } from '@/lib/utils';
import { ExampleCard } from '../../shared/components/example-card';
import { QueryError } from '../../shared/components/query-error';
import { PartnerSummary, PartnerSummarySkeleton } from './partner-summary';
import { Readout } from '../../shared/components/readout';
import { SummaryList } from './summary-list';
import { EXAMPLE_PAGE_SIZE } from '../../shared/constants/demo';
import { paginationSearchParams } from '../lib/search-params';

const COPY = {
  title: 'Partners, five per page',
  description:
    'keepPreviousData keeps this page on screen while the next loads, and the next page is prefetched.',
  source: 'src/features/examples/data-fetching/components/paginated-partners.tsx'
} as const;

export function PaginatedPartners() {
  const [{ page }, setParams] = useQueryStates(paginationSearchParams);
  const queryClient = useQueryClient();
  const filters = { page, limit: EXAMPLE_PAGE_SIZE };

  const { data, error, isPlaceholderData } = useQuery({
    ...partnersQueryOptions(filters),
    placeholderData: keepPreviousData
  });
  const totalPages = data ? pageCount(data.total_partners, EXAMPLE_PAGE_SIZE) : 1;
  const hasNext = page < totalPages;

  // Warm the cache for the next page; prefetchQuery skips it if it's already fresh.
  useEffect(() => {
    if (!hasNext) return;
    void queryClient.prefetchQuery(
      partnersQueryOptions({ page: page + 1, limit: EXAMPLE_PAGE_SIZE })
    );
  }, [hasNext, page, queryClient]);

  return (
    <ExampleCard
      {...COPY}
      controls={
        <>
          <span aria-live='polite'>
            <Readout label='Page' value={`${page} of ${totalPages}`} />
          </span>
          <div className='ms-auto flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              disabled={page <= 1}
              onClick={() => void setParams({ page: page - 1 })}
            >
              <Icons.chevronLeft aria-hidden />
              Previous
            </Button>
            <Button
              size='sm'
              variant='outline'
              // Wait for the real page before allowing another step past it.
              disabled={!hasNext || isPlaceholderData}
              onClick={() => void setParams({ page: page + 1 })}
            >
              Next
              <Icons.chevronRight aria-hidden />
            </Button>
          </div>
        </>
      }
    >
      {error && <QueryError error={error} />}
      <SummaryList
        className={cn(
          'transition-opacity duration-150',
          isPlaceholderData && 'opacity-60 delay-150'
        )}
      >
        {data ? (
          data.partners.map((partner) => (
            <li key={partner.id}>
              <PartnerSummary partner={partner} />
            </li>
          ))
        ) : error ? null : (
          <PaginatedPartnersRows />
        )}
      </SummaryList>
    </ExampleCard>
  );
}

function PaginatedPartnersRows() {
  return Array.from({ length: EXAMPLE_PAGE_SIZE }, (_, index) => (
    <li key={index}>
      <PartnerSummarySkeleton />
    </li>
  ));
}

export function PaginatedPartnersSkeleton() {
  return (
    <ExampleCard {...COPY} controls={<Skeleton className='h-5 w-24' />}>
      <SummaryList>
        <PaginatedPartnersRows />
      </SummaryList>
    </ExampleCard>
  );
}
