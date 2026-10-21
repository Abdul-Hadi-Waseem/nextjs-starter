'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { accountQueryOptions } from '../../shared/api/queries';
import { AccountDetails, AccountDetailsSkeleton } from '../../shared/components/account-details';
import { QueryError } from '../../shared/components/query-error';
import { ExampleCard } from '../../shared/components/example-card';
import { FetchedAt } from '../../shared/components/fetched-at';
import { RunsOnBadge } from '../../shared/components/runs-on-badge';
import { RUNS_ON } from '../../shared/constants/demo';

const COPY = {
  title: 'Signed in: your account',
  description:
    'Sent from the browser with the httpOnly cookie; not prefetched, so it loads after the page.',
  source: 'src/features/examples/data-fetching/components/browser-account-card.tsx'
} as const;

export function BrowserAccountCard() {
  // Client-only query: no server prefetch, so it shows a skeleton until the browser has it.
  const { data, error } = useQuery(accountQueryOptions());

  return (
    <ExampleCard
      {...COPY}
      action={<RunsOnBadge where={RUNS_ON.BROWSER} />}
      controls={data ? <FetchedAt iso={data.fetchedAt} /> : <Skeleton className='h-5 w-32' />}
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

export function BrowserAccountCardSkeleton() {
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
