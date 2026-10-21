import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { EXAMPLE_GRID } from '../../shared/constants/layout';
import { getQueryClient } from '@/lib/query-client';
import { exchangeRatesQueryOptions } from '../../shared/api/queries';
import { PartnerSearchCard } from './partner-search-card';
import { PollingRatesCard, PollingRatesCardSkeleton } from './polling-rates-card';
import { SelectedCurrenciesCard, SelectedCurrenciesCardSkeleton } from './selected-currencies-card';

export function PollingView() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(exchangeRatesQueryOptions());

  return (
    <div className={EXAMPLE_GRID}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PollingRatesCard />
        <Suspense fallback={<SelectedCurrenciesCardSkeleton />}>
          <SelectedCurrenciesCard />
        </Suspense>
      </HydrationBoundary>
      <PartnerSearchCard />
    </div>
  );
}

export function PollingSkeleton() {
  return (
    <div className={EXAMPLE_GRID}>
      <PollingRatesCardSkeleton />
      <SelectedCurrenciesCardSkeleton />
      <PartnerSearchCard />
    </div>
  );
}
