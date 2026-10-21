// ============================================================
// Payout Service — the only file that talks to the backend.
// Queries (queries.ts), mutations (mutations.ts) and components import from here.
//
// Calls go through `api` (src/lib/api), which sends the auth cookie by default.
// Out of the box they hit the mock route handlers in src/app/api/payouts;
// set NEXT_PUBLIC_API_URL to point them at your real backend.
// ============================================================

import { api } from '@/lib/api';
import type {
  PayoutFilters,
  PayoutsResponse,
  PayoutByIdResponse,
  PayoutPayload,
  PayoutMutationResponse
} from './types';

// `signal` comes from React Query, so a request whose query is no longer needed is cancelled.
export async function getPayouts(
  filters: PayoutFilters,
  signal?: AbortSignal
): Promise<PayoutsResponse> {
  return api.get<PayoutsResponse>('/payouts', { query: filters, signal });
}

export async function getPayoutById(id: string, signal?: AbortSignal): Promise<PayoutByIdResponse> {
  return api.get<PayoutByIdResponse>(`/payouts/${encodeURIComponent(id)}`, { signal });
}

export async function createPayout(data: PayoutPayload) {
  return api.post<PayoutMutationResponse>('/payouts', { body: data });
}

export async function updatePayout(id: string, data: PayoutPayload) {
  return api.put<PayoutMutationResponse>(`/payouts/${encodeURIComponent(id)}`, { body: data });
}

export async function deletePayout(id: string) {
  return api.delete<PayoutMutationResponse>(`/payouts/${encodeURIComponent(id)}`);
}
