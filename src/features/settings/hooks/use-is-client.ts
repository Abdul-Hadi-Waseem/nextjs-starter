import { useSyncExternalStore } from 'react';

function subscribe() {
  return () => {};
}

/**
 * False during the server render and hydration, true after. Use it for values only the
 * browser knows (next-themes' stored mode), so the first client render matches the server.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
