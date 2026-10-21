import { Skeleton } from '@/components/ui/skeleton';
import { getCachedExchangeRates } from '../../shared/api/service';
import { ExampleCard } from '../../shared/components/example-card';
import { ExchangeRatesList, ExchangeRatesListSkeleton } from './exchange-rates-list';
import { FetchedAt } from '../../shared/components/fetched-at';
import { RunsOnBadge } from '../../shared/components/runs-on-badge';
import { EXCHANGE_RATES_CACHE } from '../../shared/constants/cache';
import { RUNS_ON } from '../../shared/constants/demo';
import { RefreshRatesButton } from './refresh-rates-button';

const COPY = {
  title: 'Shared data: server cache',
  description: `Kept in the Next.js data cache for ${EXCHANGE_RATES_CACHE.revalidateSeconds} s under a tag, so a reload shows the same fetch time.`,
  source: 'src/features/examples/data-fetching/components/server-cached-rates-card.tsx'
} as const;

// Async server component: no client JS for the data, one cached answer for every user.
export async function ServerCachedRatesCard() {
  const data = await getCachedExchangeRates();

  return (
    <ExampleCard
      {...COPY}
      action={<RunsOnBadge where={RUNS_ON.SERVER} />}
      controls={
        <>
          <FetchedAt iso={data.fetchedAt} />
          <RefreshRatesButton />
        </>
      }
    >
      <ExchangeRatesList data={data} />
    </ExampleCard>
  );
}

export function ServerCachedRatesCardSkeleton() {
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
