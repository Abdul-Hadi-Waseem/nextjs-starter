// Column ids double as URL keys (`?name=…&status=…&sort=revenue.desc`) and as the
// backend's sort fields, so they match the Partner type's property names.
export const PARTNER_COLUMN = {
  NAME: 'name',
  TIER: 'tier',
  STATUS: 'status',
  COUNTRY: 'country',
  REVENUE: 'revenue',
  PAID_OUT: 'payoutsTotal',
  JOINED: 'joinedAt',
  ACTIONS: 'actions'
} as const;

export const PARTNER_TABLE_PAGE_SIZE = 10;

/** Columns rendered by the partners table, used to size its loading skeleton. */
export const PARTNER_TABLE_COLUMN_COUNT = Object.keys(PARTNER_COLUMN).length;

/** Toolbar filters (search, status, tier), used to size the loading skeleton. */
export const PARTNER_TABLE_FILTER_COUNT = 3;

export const PARTNER_SEARCH_DEBOUNCE_MS = 500;

/** How many payouts the partner page lists before "View all". */
export const PARTNER_RECENT_PAYOUTS_LIMIT = 5;

/** How long the copy button shows its check mark. */
export const COPY_FEEDBACK_MS = 1500;
