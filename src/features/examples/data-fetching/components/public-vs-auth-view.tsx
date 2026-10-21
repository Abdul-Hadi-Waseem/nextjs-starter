import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { EXAMPLE_GRID } from '../../shared/constants/layout';
import { getQueryClient } from '@/lib/query-client';
import { exchangeRatesQueryOptions } from '../../shared/api/queries';
import { BrowserAccountCard, BrowserAccountCardSkeleton } from './browser-account-card';
import { PublicRatesCard, PublicRatesCardSkeleton } from './public-rates-card';
import { SignedOutCard, SignedOutCardSkeleton } from './signed-out-card';

export function PublicVsAuthView() {
  const queryClient = getQueryClient();
  // Only the public call is prefetched; the signed-in one runs in the browser (see its card).
  void queryClient.prefetchQuery(exchangeRatesQueryOptions());

  return (
    <div className={EXAMPLE_GRID}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<PublicRatesCardSkeleton />}>
          <PublicRatesCard />
        </Suspense>
      </HydrationBoundary>
      <BrowserAccountCard />
      <Suspense fallback={<SignedOutCardSkeleton />}>
        <SignedOutCard />
      </Suspense>
    </div>
  );
}

export function PublicVsAuthSkeleton() {
  return (
    <div className={EXAMPLE_GRID}>
      <PublicRatesCardSkeleton />
      <BrowserAccountCardSkeleton />
      <SignedOutCardSkeleton />
    </div>
  );
}
