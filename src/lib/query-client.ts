import {
  MutationCache,
  QueryCache,
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer
} from '@tanstack/react-query';
import { AUTH, isApiError } from '@/lib/api';

const MAX_RETRIES = 2;

// A 401 means the session is gone: drop cached data and send the user to sign in.
function handleUnauthorized(error: unknown, queryClient: QueryClient) {
  if (isServer || !isApiError(error) || !error.isUnauthorized) return;
  if (window.location.pathname.startsWith(AUTH.signInPath)) return;

  queryClient.clear();
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.assign(`${AUTH.signInPath}?next=${next}`);
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

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
