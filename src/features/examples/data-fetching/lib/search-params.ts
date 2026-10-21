import { createSearchParamsCache, parseAsInteger } from 'nuqs/server';

// The pagination example keeps its page in the URL (?page=2), read on the server
// for the prefetch and on the client with the same parser so the query keys match.
export const paginationSearchParams = {
  page: parseAsInteger.withDefault(1)
};

export const paginationSearchParamsCache = createSearchParamsCache(paginationSearchParams);
