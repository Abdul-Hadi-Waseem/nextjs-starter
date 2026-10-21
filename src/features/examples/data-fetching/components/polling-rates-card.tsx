'use client';

import { useQuery } from '@tanstack/react-query';
import { Icons } from '@/components/icons';
import { LoadingButton } from '@/components/ui/loading-button';
import { Skeleton } from '@/components/ui/skeleton';
import { exchangeRatesQueryOptions } from '../../shared/api/queries';
import { QueryError } from '../../shared/components/query-error';
import { ExampleCard } from '../../shared/components/example-card';
import { ExchangeRatesList, ExchangeRatesListSkeleton } from './exchange-rates-list';
import { FetchedAt } from '../../shared/components/fetched-at';
import { Readout } from '../../shared/components/readout';
import { POLL_INTERVAL_MS, SECOND } from '../../shared/constants/cache';

const COPY = {
  title: 'Polling',
  description: `refetchInterval refetches every ${POLL_INTERVAL_MS / SECOND} s and pauses while the tab is hidden.`,
  source: 'src/features/examples/data-fetching/components/polling-rates-card.tsx'
} as const;

const BOOLEAN_VALUES = ['false', 'true'] as const;

export function PollingRatesCard() {
  // useQuery (not the Suspense version) so isPending can be true on a first load without data.
  const { data, error, isPending, isFetching, refetch } = useQuery({
    ...exchangeRatesQueryOptions(),
    refetchInterval: POLL_INTERVAL_MS
  });

  return (
    <ExampleCard
      {...COPY}
      controls={
        <>
          {data ? <FetchedAt iso={data.fetchedAt} /> : <Skeleton className='h-5 w-32' />}
          {/* isPending: no data yet (first load). isFetching: any request in flight, including
              background refetches; it shows only when a request lasts over 150ms. */}
          <Readout label='isPending' value={String(isPending)} values={BOOLEAN_VALUES} />
          <Readout
            label='isFetching'
            value={String(isFetching)}
            values={BOOLEAN_VALUES}
            busy={isFetching}
          />
          <LoadingButton
            size='sm'
            variant='outline'
            loading={isFetching}
            loadingLabel='Refetching rates'
            onClick={() => void refetch()}
            className='ms-auto'
          >
            <Icons.refresh aria-hidden />
            Refetch
          </LoadingButton>
        </>
      }
    >
      {error && !data ? (
        <QueryError error={error} />
      ) : data ? (
        <ExchangeRatesList data={data} />
      ) : (
        <ExchangeRatesListSkeleton />
      )}
    </ExampleCard>
  );
}

export function PollingRatesCardSkeleton() {
  return (
    <ExampleCard {...COPY} controls={<Skeleton className='h-5 w-32' />}>
      <ExchangeRatesListSkeleton />
    </ExampleCard>
  );
}
