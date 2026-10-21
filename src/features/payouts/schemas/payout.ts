import * as z from 'zod';
import { PAYOUT_METHOD, PAYOUT_NOTE_MAX_LENGTH, PAYOUT_STATUS } from '../constants/payout-options';

export const payoutSchema = z.object({
  partnerId: z.string().min(1, 'Please select a partner'),
  amount: z.number({ message: 'Amount is required' }).positive('Amount must be greater than 0'),
  scheduledFor: z
    .string()
    .min(1, 'Please pick a date')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Please pick a valid date'),
  method: z.enum(PAYOUT_METHOD, { message: 'Please select a payout method' }),
  note: z
    .string()
    .max(PAYOUT_NOTE_MAX_LENGTH, `Note must be at most ${PAYOUT_NOTE_MAX_LENGTH} characters`)
    .nullish()
});

export type PayoutFormValues = z.infer<typeof payoutSchema>;

// Updates may also move a payout between statuses (e.g. mark as paid).
export const payoutUpdateSchema = payoutSchema.extend({
  status: z.enum(PAYOUT_STATUS).optional()
});

export type PayoutUpdateValues = z.infer<typeof payoutUpdateSchema>;

// The sheet form edits `scheduledFor` with a date picker (a `Date`), so it
// validates against this variant and converts to the API's date string on submit.
export const payoutFormSchema = payoutSchema.extend({
  scheduledFor: z.date({ message: 'Please pick a date' })
});

export type PayoutFormInput = z.input<typeof payoutFormSchema>;
export type PayoutFormOutput = z.output<typeof payoutFormSchema>;
