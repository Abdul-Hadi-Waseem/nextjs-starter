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
