'use client';

import { useQuery } from '@tanstack/react-query';
import { Icons } from '@/components/icons';
import { LoadingButton } from '@/components/ui/loading-button';
import { Skeleton } from '@/components/ui/skeleton';
import { accountQueryOptions } from '../../shared/api/queries';
import { AccountDetails, AccountDetailsSkeleton } from '../../shared/components/account-details';
import { QueryError } from '../../shared/components/query-error';
import { ExampleCard } from '../../shared/components/example-card';
import { FetchedAt } from '../../shared/components/fetched-at';
import { Readout } from '../../shared/components/readout';
import { ACCOUNT_QUERY_CACHE, SECOND } from '../../shared/constants/cache';

const COPY = {
  title: 'Your data: browser only',
  description: `Never cached on the server; TanStack Query keeps it fresh for ${ACCOUNT_QUERY_CACHE.staleTime / SECOND} s, so coming back within that sends no request.`,
  source: 'src/features/examples/data-fetching/components/browser-cached-account-card.tsx'
} as const;

const FRESHNESS = { FRESH: 'fresh', STALE: 'stale' } as const;
const FRESHNESS_VALUES = Object.values(FRESHNESS);

export function BrowserCachedAccountCard() {
  const { data, error, isStale, isFetching, refetch } = useQuery(accountQueryOptions());

  return (
    <ExampleCard
      {...COPY}
      controls={
        <>
          {data ? (
            <>
              <FetchedAt iso={data.fetchedAt} />
              <Readout
                label='Cache'
                value={isStale ? FRESHNESS.STALE : FRESHNESS.FRESH}
                values={FRESHNESS_VALUES}
              />
            </>
          ) : (
            <Skeleton className='h-5 w-32' />
          )}
          <LoadingButton
            size='sm'
            variant='outline'
            loading={isFetching}
            loadingLabel='Refetching your account'
            onClick={() => void refetch()}
            className='ms-auto'
          >
            <Icons.refresh aria-hidden />
            Refetch
          </LoadingButton>
        </>
      }
    >
      {error ? (
        <QueryError error={error} />
      ) : data ? (
        <AccountDetails account={data} />
      ) : (
        <AccountDetailsSkeleton />
      )}
    </ExampleCard>
  );
}

export function BrowserCachedAccountCardSkeleton() {
  return (
    <ExampleCard {...COPY} controls={<Skeleton className='h-5 w-32' />}>
      <AccountDetailsSkeleton />
    </ExampleCard>
  );
}
