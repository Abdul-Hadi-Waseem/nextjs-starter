'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { exchangeRatesQueryOptions } from '../../shared/api/queries';
import { ExampleCard } from '../../shared/components/example-card';
import { ExchangeRatesList, ExchangeRatesListSkeleton } from './exchange-rates-list';
import { FetchedAt } from '../../shared/components/fetched-at';
import { RunsOnBadge } from '../../shared/components/runs-on-badge';
import { RUNS_ON } from '../../shared/constants/demo';

const COPY = {
  title: 'Public: exchange rates',
  description:
    'Fetched with { auth: false } and prefetched on the server, so it is in the first HTML.',
  source: 'src/features/examples/data-fetching/components/public-rates-card.tsx'
} as const;

export function PublicRatesCard() {
  // Already in the cache: the server prefetched it and HydrationBoundary handed it over.
  const { data } = useSuspenseQuery(exchangeRatesQueryOptions());

  return (
    <ExampleCard
      {...COPY}
      action={<RunsOnBadge where={RUNS_ON.SERVER} />}
      controls={<FetchedAt iso={data.fetchedAt} />}
    >
      <ExchangeRatesList data={data} />
    </ExampleCard>
  );
}

export function PublicRatesCardSkeleton() {
  return (
    <ExampleCard
      {...COPY}
      action={<RunsOnBadge where={RUNS_ON.SERVER} />}
      controls={<Skeleton className='h-5 w-32' />}
    >
      <ExchangeRatesListSkeleton />
    </ExampleCard>
  );
}
