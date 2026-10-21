import { createParser, parseAsInteger, parseAsString, type inferParserType } from 'nuqs/server';
import { getSortingStateParser } from '@/lib/data-table/parsers';
import type { PayoutFilters } from '../api/types';
import {
  PAYOUT_NEW_FLAG,
  PAYOUT_SEARCH_PARAM,
  PAYOUT_TABLE_DEFAULT_PAGE_SIZE
} from '../constants/payout-table';

/** `?new=1` ⇄ `true`; anything else reads as closed. */
const parseAsNewFlag = createParser<boolean>({
  parse: (value) => (value === PAYOUT_NEW_FLAG ? true : null),
  serialize: () => PAYOUT_NEW_FLAG
});

// Shared by the server cache and the client hooks, so the prefetched query key
// and the client's query key are built from the same parsed values.
export const payoutTableParsers = {
  [PAYOUT_SEARCH_PARAM.PAGE]: parseAsInteger.withDefault(1),
  [PAYOUT_SEARCH_PARAM.PER_PAGE]: parseAsInteger.withDefault(PAYOUT_TABLE_DEFAULT_PAGE_SIZE),
  [PAYOUT_SEARCH_PARAM.SEARCH]: parseAsString,
  [PAYOUT_SEARCH_PARAM.STATUS]: parseAsString,
  [PAYOUT_SEARCH_PARAM.PARTNER]: parseAsString,
  [PAYOUT_SEARCH_PARAM.SORT]: getSortingStateParser().withDefault([])
};

export const payoutSheetParsers = {
  [PAYOUT_SEARCH_PARAM.NEW]: parseAsNewFlag,
  [PAYOUT_SEARCH_PARAM.PARTNER]: parseAsString
};

type PayoutTableParams = inferParserType<typeof payoutTableParsers>;

/** URL state → API filters. Same shape on server and client. */
export function toPayoutFilters(params: PayoutTableParams): PayoutFilters {
  return {
    page: params.page,
    limit: params.perPage,
    ...(params.search && { search: params.search }),
    ...(params.status && { status: params.status }),
    ...(params.partner && { partnerId: params.partner }),
    ...(params.sort.length > 0 && { sort: JSON.stringify(params.sort) })
  };
}
