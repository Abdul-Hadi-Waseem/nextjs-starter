import { formatDate } from '@/lib/format';

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1
});
const countFormatter = new Intl.NumberFormat('en-US');
const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 0
});

/** `80000` → `$80K` (axis ticks, donut center) */
export function formatCompactCurrency(value: number) {
  return compactCurrencyFormatter.format(value);
}

/** `1234` → `1,234` */
export function formatCount(value: number) {
  return countFormatter.format(value);
}

/** `0.42` → `42%` */
export function formatPercent(ratio: number) {
  return percentFormatter.format(ratio);
}

/**
 * `2026-03` → `Mar` (or `Mar 2026`). Months are `YYYY-MM`; formatted in UTC so the
 * label never slips a month by time zone.
 */
export function formatMonth(month: string, withYear = false) {
  return formatDate(`${month}-01T00:00:00Z`, {
    timeZone: 'UTC',
    month: 'short',
    day: undefined,
    year: withYear ? 'numeric' : undefined
  });
}
