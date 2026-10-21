'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { LoadingButton } from '@/components/ui/loading-button';
import { Skeleton } from '@/components/ui/skeleton';
import { payoutsInfiniteQueryOptions } from '../../shared/api/queries';
import { ExampleCard } from '../../shared/components/example-card';
import { PayoutSummary, PayoutSummarySkeleton } from './payout-summary';
import { Readout } from '../../shared/components/readout';
import { SummaryList } from './summary-list';
import { EXAMPLE_PAGE_SIZE } from '../../shared/constants/demo';

const COPY = {
  title: 'All payouts',
  description:
    'Load more fetches the next page and appends it; getNextPageParam stops when none are left.',
  source: 'src/features/examples/data-fetching/components/infinite-payouts.tsx'
} as const;

export function InfinitePayouts() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    payoutsInfiniteQueryOptions()
  );
  const payouts = data.pages.flatMap((page) => page.payouts);
  const total = data.pages[0]?.total_payouts ?? 0;
  const firstPageSize = data.pages[0]?.payouts.length ?? 0;

  return (
    <ExampleCard
      {...COPY}
      controls={
        <>
          <span aria-live='polite'>
            <Readout label='Showing' value={`${payouts.length} of ${total}`} />
          </span>
          {hasNextPage && (
            <LoadingButton
              size='sm'
              variant='outline'
              loading={isFetchingNextPage}
              loadingLabel='Loading more payouts'
              onClick={() => void fetchNextPage()}
              className='ms-auto'
            >
              Load more
            </LoadingButton>
          )}
        </>
      }
    >
      <SummaryList>
        {payouts.map((payout, index) => (
          // Rows from later pages fade in (motion-safe); the first page is already there.
          <li
            key={payout.id}
            className={
              index >= firstPageSize
                ? 'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-150'
                : undefined
            }
          >
            <PayoutSummary payout={payout} />
          </li>
        ))}
      </SummaryList>
    </ExampleCard>
  );
}

export function InfinitePayoutsSkeleton() {
  return (
    <ExampleCard {...COPY} controls={<Skeleton className='h-5 w-28' />}>
      <SummaryList>
        {Array.from({ length: EXAMPLE_PAGE_SIZE }, (_, index) => (
          <li key={index}>
            <PayoutSummarySkeleton />
          </li>
        ))}
      </SummaryList>
    </ExampleCard>
  );
}
