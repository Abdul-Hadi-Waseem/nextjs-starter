export const PAYOUT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  FAILED: 'failed'
} as const;

export type PayoutStatus = (typeof PAYOUT_STATUS)[keyof typeof PAYOUT_STATUS];

export const PAYOUT_STATUS_LABEL: Record<PayoutStatus, string> = {
  [PAYOUT_STATUS.PAID]: 'Paid',
  [PAYOUT_STATUS.PENDING]: 'Pending',
  [PAYOUT_STATUS.FAILED]: 'Failed'
};

export const payoutStatusOptions = Object.values(PAYOUT_STATUS).map((value) => ({
  value,
  label: PAYOUT_STATUS_LABEL[value]
}));

export const PAYOUT_METHOD = {
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal',
  WISE: 'wise'
} as const;

export type PayoutMethod = (typeof PAYOUT_METHOD)[keyof typeof PAYOUT_METHOD];

export const PAYOUT_METHOD_LABEL: Record<PayoutMethod, string> = {
  [PAYOUT_METHOD.BANK_TRANSFER]: 'Bank transfer',
  [PAYOUT_METHOD.PAYPAL]: 'PayPal',
  [PAYOUT_METHOD.WISE]: 'Wise'
};

export const payoutMethodOptions = Object.values(PAYOUT_METHOD).map((value) => ({
  value,
  label: PAYOUT_METHOD_LABEL[value]
}));

export const PAYOUT_CURRENCY = {
  USD: 'USD'
} as const;

export type PayoutCurrency = (typeof PAYOUT_CURRENCY)[keyof typeof PAYOUT_CURRENCY];

export const PAYOUT_NOTE_MAX_LENGTH = 280;
