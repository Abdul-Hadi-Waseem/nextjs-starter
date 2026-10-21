// ============================================================
// Partner Service — the only file that talks to the backend.
// Queries (queries.ts) and components import from here.
//
// Calls go through `api` (src/lib/api), which sends the auth cookie by default.
// Out of the box they hit the mock route handlers in src/app/api/partners;
// set NEXT_PUBLIC_API_URL to point them at your real backend.
// ============================================================

import { api } from '@/lib/api';
import type { PartnerDetailResponse, PartnerFilters, PartnersResponse } from './types';

// `signal` comes from React Query, so a request whose query is no longer needed is cancelled.
export async function getPartners(
  filters: PartnerFilters,
  signal?: AbortSignal
): Promise<PartnersResponse> {
  return api.get<PartnersResponse>('/partners', { query: filters, signal });
}

export async function getPartnerById(
  id: string,
  signal?: AbortSignal
): Promise<PartnerDetailResponse> {
  return api.get<PartnerDetailResponse>(`/partners/${encodeURIComponent(id)}`, { signal });
}
