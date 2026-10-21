'use client';

import { useQuery } from '@tanstack/react-query';
import { Icons } from '@/components/icons';
import { LoadingButton } from '@/components/ui/loading-button';
import { Skeleton } from '@/components/ui/skeleton';
import { accountViaProxyQueryOptions } from '../../shared/api/queries';
import { AccountDetails, AccountDetailsSkeleton } from '../../shared/components/account-details';
import { QueryError } from '../../shared/components/query-error';
import { ExampleCard } from '../../shared/components/example-card';
import { FetchedAt } from '../../shared/components/fetched-at';
import { RunsOnBadge } from '../../shared/components/runs-on-badge';
import { RUNS_ON } from '../../shared/constants/demo';

const COPY = {
  title: 'Your account, through the proxy',
  description:
    'The browser calls a route handler here, which adds a server-only key before calling the backend.',
  source: 'src/features/examples/server-side/components/proxy-account-card.tsx'
} as const;

export function ProxyAccountCard() {
  const { data, error, isFetching, refetch } = useQuery(accountViaProxyQueryOptions());

  return (
    <ExampleCard
      {...COPY}
      action={<RunsOnBadge where={RUNS_ON.BROWSER} />}
      controls={
        <>
          {data ? <FetchedAt iso={data.fetchedAt} /> : <Skeleton className='h-5 w-32' />}
          <LoadingButton
            size='sm'
            variant='outline'
            loading={isFetching}
            loadingLabel='Calling the proxy'
            onClick={() => void refetch()}
            className='ms-auto'
          >
            <Icons.refresh aria-hidden />
            Call again
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

export function ProxyAccountCardSkeleton() {
  return (
    <ExampleCard
      {...COPY}
      action={<RunsOnBadge where={RUNS_ON.BROWSER} />}
      controls={<Skeleton className='h-5 w-32' />}
    >
      <AccountDetailsSkeleton />
    </ExampleCard>
  );
}
