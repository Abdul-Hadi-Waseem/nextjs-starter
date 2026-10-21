// Server-only: page.tsx parses the URL once, payout-listing.tsx reads it.
import { createSearchParamsCache } from 'nuqs/server';
import { payoutTableParsers } from './search-params';

export const payoutsSearchParamsCache = createSearchParamsCache(payoutTableParsers);
