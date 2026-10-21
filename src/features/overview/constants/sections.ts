// Card titles and descriptions, shared by each section and its loading skeleton so
// the header is identical in both (no shift when the data arrives).
export const OVERVIEW_SECTION = {
  TREND: {
    title: 'Revenue and payouts',
    description: 'Partner revenue and paid payouts per month, last 12 months'
  },
  STATUS: {
    title: 'Payouts by status',
    description: 'Count and amount of every payout on record'
  },
  GROWTH: {
    title: 'Active partners',
    description: 'Active partners by tier at the end of each month, by join date'
  },
  METHODS: {
    title: 'Payouts by method',
    description: 'Paid amount per payout method, last 12 months'
  },
  AVERAGE: {
    title: 'Average payout',
    description: 'Average paid payout per month, against the 12-month average'
  },
  TOP_PARTNERS: {
    title: 'Top partners',
    description: 'The five partners with the highest lifetime revenue'
  },
  RECENT: {
    title: 'Recent payouts',
    description: 'The six most recently created payouts'
  }
} as const;
