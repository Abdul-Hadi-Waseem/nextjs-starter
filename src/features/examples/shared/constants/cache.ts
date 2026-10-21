// Cache settings the caching examples demonstrate. Values are short so the effect is visible.

/** Public, shared data: kept in Next.js's server cache and refreshed by tag. */
export const EXCHANGE_RATES_CACHE = {
  tag: 'examples-exchange-rates',
  revalidateSeconds: 60
} as const;

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;

/** Per-user data: cached only in the browser by TanStack Query. */
export const ACCOUNT_QUERY_CACHE = {
  // Fresh for 30 s: remounts and navigation within that window don't refetch.
  staleTime: 30 * SECOND,
  // Kept 10 min (TanStack's default is 5) after the last component using it unmounts.
  gcTime: 10 * MINUTE
} as const;

export const POLL_INTERVAL_MS = 5 * SECOND;
