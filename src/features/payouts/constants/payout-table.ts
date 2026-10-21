// URL keys for the payouts page. Column filter ids double as URL keys in
// `useDataTable`, so the filterable columns reuse these values as their ids.
export const PAYOUT_SEARCH_PARAM = {
  PAGE: 'page',
  PER_PAGE: 'perPage',
  SORT: 'sort',
  SEARCH: 'search',
  STATUS: 'status',
  /** Filter by partner id; also preselects the partner in the new-payout sheet */
  PARTNER: 'partner',
  /** `?new=1` opens the new-payout sheet (deep-linkable from the partner page) */
  NEW: 'new'
} as const;

/** Value `?new=` takes when the sheet is open. */
export const PAYOUT_NEW_FLAG = '1';

export const PAYOUT_COLUMN = {
  SEARCH: PAYOUT_SEARCH_PARAM.SEARCH,
  PARTNER: 'partnerName',
  AMOUNT: 'amount',
  STATUS: PAYOUT_SEARCH_PARAM.STATUS,
  METHOD: 'method',
  SCHEDULED_FOR: 'scheduledFor',
  PAID_AT: 'paidAt',
  ACTIONS: 'actions'
} as const;

export const PAYOUT_TABLE_DEFAULT_PAGE_SIZE = 10;
/** Columns in the payouts table, used by the loading skeleton. */
export const PAYOUT_TABLE_COLUMN_COUNT = Object.keys(PAYOUT_COLUMN).length;
/** Search input + status filter in the toolbar. */
export const PAYOUT_TABLE_FILTER_COUNT = 2;

/** How long the submit button shows its check mark before the sheet closes. */
export const PAYOUT_FORM_SUCCESS_MS = 1200;
/** Partners loaded into the form's partner picker. */
export const PAYOUT_PARTNER_OPTIONS_LIMIT = 100;
export const PAYOUT_FORM_ID = 'payout-form';

export const PAYOUT_SEARCH_DEBOUNCE_MS = 500;
