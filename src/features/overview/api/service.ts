// ============================================================
// Overview Service — the only file that talks to the backend.
// Queries (queries.ts) and components import from here.
//
// Calls go through `api` (src/lib/api), which sends the auth cookie by default.
// Out of the box it hits the mock route handler in src/app/api/overview;
// set NEXT_PUBLIC_API_URL to point it at your real backend.
// ============================================================

import { api } from '@/lib/api';
import type { OverviewResponse } from './types';

export async function getOverview(): Promise<OverviewResponse> {
  return api.get<OverviewResponse>('/overview');
}
