import { HTTP_STATUS, isApiError } from '@/lib/api';
import type { Payout, PayoutPayload } from '../api/types';
import { PAYOUT_METHOD, type PayoutCurrency } from '../constants/payout-options';
import type { PayoutFormInput, PayoutFormOutput } from '../schemas/payout';

/**
 * What the sheet form holds while editing: like the schema input, but the
 * amount and date can be empty until the user fills them in.
 */
export type PayoutFormState = Omit<PayoutFormInput, 'amount' | 'scheduledFor'> & {
  amount: number | undefined;
  scheduledFor: Date | undefined;
};

export const PAYOUT_FORM_FIELDS = [
  'partnerId',
  'amount',
  'scheduledFor',
  'method',
  'note'
] as const satisfies readonly (keyof PayoutFormState)[];

export type PayoutFormField = (typeof PAYOUT_FORM_FIELDS)[number];

export function isPayoutFormField(name: string): name is PayoutFormField {
  return (PAYOUT_FORM_FIELDS as readonly string[]).includes(name);
}

const pad = (value: number) => String(value).padStart(2, '0');

/** Local calendar day → `YYYY-MM-DD` (what the API stores). */
export function toDateOnlyString(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `YYYY-MM-DD` → local midnight, so the date picker shows the same day. */
export function fromDateOnlyString(value: string) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getPayoutFormDefaults(
  payout: Payout | null,
  defaultPartnerId: string | null
): PayoutFormState {
  return {
    partnerId: payout?.partnerId ?? defaultPartnerId ?? '',
    amount: payout?.amount,
    scheduledFor: payout ? fromDateOnlyString(payout.scheduledFor) : undefined,
    method: payout?.method ?? PAYOUT_METHOD.BANK_TRANSFER,
    note: payout?.note ?? ''
  };
}

export function toPayoutPayload(values: PayoutFormOutput): PayoutPayload {
  return {
    partnerId: values.partnerId,
    amount: values.amount,
    scheduledFor: toDateOnlyString(values.scheduledFor),
    method: values.method,
    note: values.note?.trim() || null
  };
}

/** Same fields as the payout, with a new status (used by "Mark as paid"). */
export function toStatusPayload(payout: Payout, status: Payout['status']): PayoutPayload {
  return {
    partnerId: payout.partnerId,
    amount: payout.amount,
    scheduledFor: payout.scheduledFor,
    method: payout.method,
    note: payout.note,
    status
  };
}

export function getCurrencySymbol(currency: PayoutCurrency) {
  return (
    new Intl.NumberFormat('en-US', { style: 'currency', currency })
      .formatToParts(0)
      .find((part) => part.type === 'currency')?.value ?? currency
  );
}

function isStringRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Field errors from a 400 response shaped `{ errors: { field: string[] } }`,
 * or `null` when the error carries none.
 */
export function getApiFieldErrors(error: unknown): Record<string, string[]> | null {
  if (!isApiError(error) || error.status !== HTTP_STATUS.BAD_REQUEST) return null;
  if (!isStringRecord(error.body) || !isStringRecord(error.body.errors)) return null;

  const entries = Object.entries(error.body.errors)
    .map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages.filter((m): m is string => typeof m === 'string') : []
    ])
    .filter(([, messages]) => messages.length > 0);

  return entries.length > 0 ? Object.fromEntries(entries) : null;
}
