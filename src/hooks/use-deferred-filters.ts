'use client';

import { useDeferredValue, useMemo } from 'react';

/**
 * Defers a table's filters so a new page/filter/sort keeps the current rows on screen
 * (dim them while `isStale`) instead of suspending back to the route skeleton.
 * Dim after a delay (`opacity-60 delay-150` only in the stale state), so a fast
 * response never blinks and the rows come back at once.
 * The filters are deferred as a JSON string because useDeferredValue compares with
 * Object.is, and a freshly built object would never match.
 */
export function useDeferredFilters<T>(current: T) {
  const key = JSON.stringify(current);
  const deferredKey = useDeferredValue(key);
  const filters = useMemo(() => JSON.parse(deferredKey) as T, [deferredKey]);
  return { filters, isStale: key !== deferredKey };
}
