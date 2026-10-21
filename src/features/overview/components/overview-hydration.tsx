import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { overviewQueryOptions } from '../api/queries';

// Starts the one overview request on the server and hands it to the client. The
// prefetch isn't awaited: the pending query is dehydrated and every section's
// `useSuspenseQuery` waits on that same promise, behind the route's loading.tsx.
export function OverviewHydration({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(overviewQueryOptions());
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
