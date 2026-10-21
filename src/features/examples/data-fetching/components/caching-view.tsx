import { Suspense } from 'react';
import { EXAMPLE_GRID } from '../../shared/constants/layout';
import {
  BrowserCachedAccountCard,
  BrowserCachedAccountCardSkeleton
} from './browser-cached-account-card';
import { CacheHeadersCard } from './cache-headers-card';
import { ServerCachedRatesCard, ServerCachedRatesCardSkeleton } from './server-cached-rates-card';

export function CachingView() {
  return (
    <div className={EXAMPLE_GRID}>
      <Suspense fallback={<ServerCachedRatesCardSkeleton />}>
        <ServerCachedRatesCard />
      </Suspense>
      <BrowserCachedAccountCard />
      <CacheHeadersCard />
    </div>
  );
}

export function CachingSkeleton() {
  return (
    <div className={EXAMPLE_GRID}>
      <ServerCachedRatesCardSkeleton />
      <BrowserCachedAccountCardSkeleton />
      <CacheHeadersCard />
    </div>
  );
}
