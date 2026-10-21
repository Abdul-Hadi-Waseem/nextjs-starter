import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { meQueryOptions } from '@/features/auth/api/queries';
import { getQueryClient } from '@/lib/query-client';
import { AccessDemo, AccessDemoSkeleton } from './access-demo';

export function AccessView() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(meQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AccessDemoSkeleton />}>
        <AccessDemo />
      </Suspense>
    </HydrationBoundary>
  );
}
