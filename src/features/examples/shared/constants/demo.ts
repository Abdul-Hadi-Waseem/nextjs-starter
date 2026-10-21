// Sizes and timings for the data-fetching examples.
export const EXAMPLE_PAGE_SIZE = 5;
export const PARTNER_PICKER_SIZE = 6;
export const PARTNER_SEARCH_LIMIT = 5;

/** Checklist task titles (form maxLength and the route's zod schema). */
export const TASK_TITLE_MAX_LENGTH = 80;
/** The mock keeps only the latest tasks, so a demo deployment can't be filled up. */
export const CHECKLIST_MAX_ITEMS = 20;

/** Same filters on the server prefetch and the client query, so the keys match. */
export const PARTNER_PICKER_FILTERS = { limit: PARTNER_PICKER_SIZE } as const;
/** One row is enough: only the totals are shown. */
export const TOTALS_FILTERS = { limit: 1 } as const;

/** Query-string flag the example routes read to fail on purpose (see src/app/api/_mock/failure.ts). */
export const FAIL_QUERY = { fail: 'true' } as const;

/** Where an example call runs (RunsOnBadge). */
export const RUNS_ON = {
  SERVER: 'server',
  BROWSER: 'browser'
} as const;

export type RunsOn = (typeof RUNS_ON)[keyof typeof RUNS_ON];
