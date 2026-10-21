import type { PayoutCurrency, PayoutMethod, PayoutStatus } from '../constants/payout-options';

export type Payout = {
  id: string;
  partnerId: string;
  partnerName: string;
  amount: number;
  currency: PayoutCurrency;
  status: PayoutStatus;
  method: PayoutMethod;
  /** ISO date (YYYY-MM-DD) */
  scheduledFor: string;
  paidAt: string | null;
  note: string | null;
  createdAt: string;
};

export type PayoutFilters = {
  page?: number;
  limit?: number;
  search?: string;
  /** Comma-separated PayoutStatus values */
  status?: string;
  partnerId?: string;
  sort?: string;
};

export type PayoutsResponse = {
  success: boolean;
  time: string;
  message: string;
  total_payouts: number;
  offset: number;
  limit: number;
  payouts: Payout[];
};

export type PayoutByIdResponse = {
  success: boolean;
  payout: Payout;
};

export type PayoutPayload = {
  partnerId: string;
  amount: number;
  /** Date string (YYYY-MM-DD or ISO) */
  scheduledFor: string;
  method: PayoutMethod;
  note?: string | null;
  /** Update only — defaults to pending on create */
  status?: PayoutStatus;
};

export type PayoutMutationResponse = {
  success: boolean;
  message: string;
  payout?: Payout;
};
