// Auth endpoints. The backend sets and clears the httpOnly session cookie;
// the frontend never reads the token.
import { api } from '@/lib/api';
import type { AuthResponse, LoginPayload } from './types';

export async function login(data: LoginPayload) {
  return api.post<AuthResponse>('/auth/login', { body: data });
}

export async function logout() {
  return api.post<{ success: boolean }>('/auth/logout');
}

export async function getMe() {
  return api.get<AuthResponse>('/auth/me');
}
