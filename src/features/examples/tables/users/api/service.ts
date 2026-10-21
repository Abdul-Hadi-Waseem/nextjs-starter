// ============================================================
// User Service — the only file that talks to the backend.
// Queries (queries.ts), mutations (mutations.ts) and components import from here.
//
// Calls go through `api` (src/lib/api), which sends the auth cookie by default.
// Out of the box they hit the mock route handlers in src/app/api/users;
// set NEXT_PUBLIC_API_URL to point them at your real backend.
// ============================================================

import { api } from '@/lib/api';
import type {
  UserFilters,
  UsersResponse,
  UserMutationPayload,
  UserMutationResponse
} from './types';

// `signal` comes from React Query, so a request whose query is no longer needed is cancelled.
export async function getUsers(filters: UserFilters, signal?: AbortSignal): Promise<UsersResponse> {
  return api.get<UsersResponse>('/users', { query: filters, signal });
}

export async function createUser(data: UserMutationPayload) {
  return api.post<UserMutationResponse>('/users', { body: data });
}

export async function updateUser(id: number, data: UserMutationPayload) {
  return api.put<UserMutationResponse>(`/users/${id}`, { body: data });
}

export async function deleteUser(id: number) {
  return api.delete<UserMutationResponse>(`/users/${id}`);
}
