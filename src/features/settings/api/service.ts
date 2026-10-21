// ============================================================
// Settings Service — the only file that talks to the backend.
// Queries (queries.ts), mutations (mutations.ts) and components import from here.
//
// Calls go through `api` (src/lib/api), which sends the auth cookie by default.
// Out of the box they hit the mock route handlers in src/app/api/team and
// src/app/api/auth/me; set NEXT_PUBLIC_API_URL to point them at your real backend.
// ============================================================

import { api } from '@/lib/api';
import type { ProfilePayload, ProfileResponse, TeamResponse } from './types';

export async function getTeam(): Promise<TeamResponse> {
  return api.get<TeamResponse>('/team');
}

export async function updateProfile(data: ProfilePayload) {
  return api.patch<ProfileResponse>('/auth/me', { body: data });
}
