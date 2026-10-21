import { Suspense } from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { teamQueryOptions } from '../api/queries';
import { TeamMembersSkeleton } from './team-members-skeleton';
import { TeamMembersTable } from './team-members-table';

/** Prefetches `GET /team` on the server and streams the table in. */
export function TeamListing() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(teamQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<TeamMembersSkeleton />}>
        <TeamMembersTable />
      </Suspense>
    </HydrationBoundary>
  );
}
