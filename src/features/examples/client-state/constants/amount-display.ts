export const DISPLAY_CURRENCIES = ['USD', 'EUR', 'GBP', 'PKR'] as const;

export type DisplayCurrency = (typeof DISPLAY_CURRENCIES)[number];

/** Amount the preview formats. */
export const SAMPLE_AMOUNT = 12_480.5;

export const MASKED_AMOUNT = '••••••';
