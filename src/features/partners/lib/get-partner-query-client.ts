import 'server-only';

import { cache } from 'react';

import { HTTP_STATUS, isApiError } from '@/lib/api';
import { getQueryClient } from '@/lib/query-client';
import { partnerByIdOptions } from '../api/queries';

/**
 * Fetches one partner into the request's query client, once per request:
 * `generateMetadata` and the page both call this, and React's `cache` makes the second
 * call free (a failed fetch would otherwise run again, since an errored query is stale).
 * Returns `notFound: true` on a 404 so the page can call `notFound()`; any other error
 * is rethrown for the route's error boundary.
 */
export const getPartnerQueryClient = cache(async (id: string) => {
  const queryClient = getQueryClient();
  const options = partnerByIdOptions(id);

  // No retries on the server: a failing backend should reach the error page quickly.
  await queryClient.prefetchQuery({ ...options, retry: false });

  const { error } = queryClient.getQueryState(options.queryKey) ?? {};
  if (isApiError(error) && error.status === HTTP_STATUS.NOT_FOUND) {
    return { queryClient, data: undefined, notFound: true } as const;
  }
  if (error) throw error;

  return {
    queryClient,
    data: queryClient.getQueryData(options.queryKey),
    notFound: false
  } as const;
});
