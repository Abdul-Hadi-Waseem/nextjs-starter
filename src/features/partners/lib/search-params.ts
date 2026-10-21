import { type inferParserType, parseAsInteger, parseAsString } from 'nuqs/server';

import { getSortingStateParser } from '@/lib/data-table/parsers';
import type { PartnerFilters } from '../api/types';
import { PARTNER_COLUMN, PARTNER_TABLE_PAGE_SIZE } from '../constants/partner-table';

// URL state for the partners table, owned by the feature. The same object feeds the
// server cache (search-params-cache.ts) and the client `useQueryStates`, so the
// prefetched query key and the client's key always match.
export const partnersSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(PARTNER_TABLE_PAGE_SIZE),
  [PARTNER_COLUMN.NAME]: parseAsString,
  [PARTNER_COLUMN.STATUS]: parseAsString,
  [PARTNER_COLUMN.TIER]: parseAsString,
  sort: getSortingStateParser().withDefault([])
};

type PartnersSearchParamValues = inferParserType<typeof partnersSearchParams>;

/** URL values → the filters the API expects. Multi-select values stay comma-separated. */
export function toPartnerFilters(params: PartnersSearchParamValues): PartnerFilters {
  return {
    page: params.page,
    limit: params.perPage,
    ...(params.name && { search: params.name }),
    ...(params.status && { status: params.status }),
    ...(params.tier && { tier: params.tier }),
    ...(params.sort.length > 0 && { sort: JSON.stringify(params.sort) })
  };
}
