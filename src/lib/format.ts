/**
 * `Mar 4, 2026`, formatted in UTC so server and browser render the same text and
 * calendar dates (YYYY-MM-DD) don't slip a day in negative time zones.
 */
export const SHORT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC'
};

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts
    }).format(new Date(date));
  } catch {
    return '';
  }
}

const currencyFormatters = new Map<string, Intl.NumberFormat>();

/** `1234.5` → `$1,234.50`. Formatters are cached per currency. */
export function formatCurrency(value: number | string | undefined, currency = 'USD') {
  const amount = Number(value);
  if (value === undefined || Number.isNaN(amount)) return '';

  let formatter = currencyFormatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency });
    currencyFormatters.set(currency, formatter);
  }
  return formatter.format(amount);
}

const MAX_INITIALS = 2;

/** `'Ada Lovelace'` → `'AL'`. Used for avatar fallbacks. */
export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, MAX_INITIALS)
    .toUpperCase();
}
