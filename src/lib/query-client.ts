import {
  MutationCache,
  QueryCache,
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer
} from '@tanstack/react-query';
import { cache } from 'react';
import { AUTH, isApiError, signInUrl } from '@/lib/api';

const MAX_RETRIES = 2;

// A 401 means the session is gone: drop cached data and send the user to sign in.
function handleUnauthorized(error: unknown, queryClient: QueryClient) {
  if (isServer || !isApiError(error) || !error.isUnauthorized) return;
  if (window.location.pathname.startsWith(AUTH.signInPath)) return;

  queryClient.clear();
  window.location.assign(signInUrl(window.location.pathname + window.location.search));
}

function makeQueryClient() {
  const queryClient: QueryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => handleUnauthorized(error, queryClient)
    }),
    mutationCache: new MutationCache({
      onError: (error) => handleUnauthorized(error, queryClient)
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        // 4xx errors won't fix themselves on retry; network and 5xx errors might.
        retry: (failureCount, error) =>
          !(isApiError(error) && error.isClientError) && failureCount < MAX_RETRIES
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending'
      }
    }
  });

  return queryClient;
}

// Server: one client per request (React `cache`), so the layouts and the page of a
// request share it and the same query is fetched once.
// Requests never share a client. Browser: one client for the whole session.
const getRequestQueryClient = cache(makeQueryClient);
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) return getRequestQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
