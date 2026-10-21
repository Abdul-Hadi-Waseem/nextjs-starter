// Mock-backend auth helpers. A real backend replaces all of this.
import type { NextResponse, NextRequest } from 'next/server';
import { AUTH, HTTP_STATUS } from '@/lib/api/config';

import {
  DEMO_ADMIN,
  PERMISSION,
  ROLE,
  type Permission,
  type Role
} from '@/features/auth/constants/auth';
import type { AuthUser } from '@/features/auth/api/types';
import { env } from '@/env';
import { privateJson } from './cache-control';

const MOCK_TOKEN_PREFIX = 'mock-session:';
const PERMISSIONS: Record<Role, Permission[]> = {
  [ROLE.ADMIN]: [PERMISSION.TEAM_READ, PERMISSION.TEAM_WRITE, PERMISSION.PAYOUTS_WRITE],
  [ROLE.MEMBER]: [PERMISSION.PAYOUTS_WRITE]
};

const DEFAULT_NAME = 'Demo User';

// The session cookie only carries the email, so profile edits (PATCH /auth/me)
// are kept here, keyed by email, until the dev server restarts.
const nameOverrides = new Map<string, string>();

export function setMockUserName(email: string, name: string) {
  nameOverrides.set(email, name);
}

// Mock rule: emails starting with "admin" sign in as admin, everyone else as member.
export function mockUser(email: string): AuthUser {
  const role = email.startsWith('admin') ? ROLE.ADMIN : ROLE.MEMBER;
  const name = nameOverrides.get(email) ?? DEFAULT_NAME;
  return { id: 1, name, email, role, permissions: PERMISSIONS[role] };
}

function sessionUser(req: NextRequest): AuthUser | null {
  const token = req.cookies.get(env.AUTH_COOKIE_NAME)?.value;
  if (!token?.startsWith(MOCK_TOKEN_PREFIX)) return null;
  return mockUser(decodeURIComponent(token.slice(MOCK_TOKEN_PREFIX.length)));
}

// The signed-in user, or — with auth disabled — the demo admin, so the demo still has a user.
export function currentUser(req: NextRequest): AuthUser | null {
  const user = sessionUser(req);
  if (user) return user;
  return AUTH.enabled ? null : mockUser(DEMO_ADMIN.email);
}

const ONE_DAY_SECONDS = 60 * 60 * 24;

export function setSessionCookie(res: NextResponse, email: string) {
  res.cookies.set(env.AUTH_COOKIE_NAME, MOCK_TOKEN_PREFIX + encodeURIComponent(email), {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_DAY_SECONDS
  });
  return res;
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.delete(env.AUTH_COOKIE_NAME);
  return res;
}

// When auth is enabled, mock endpoints behave like a real backend and reject
// requests without the session cookie.
export function requireSession(req: NextRequest) {
  if (!AUTH.enabled || req.cookies.has(env.AUTH_COOKIE_NAME)) return null;
  return notAuthenticated();
}

export function notAuthenticated() {
  return privateJson(
    { success: false, message: 'Not authenticated' },
    { status: HTTP_STATUS.UNAUTHORIZED }
  );
}

export const ADMIN_ONLY_MESSAGE = {
  TEAM: 'Only admins can view the team',
  USERS: 'Only admins can manage users'
} as const;

type AdminOnlyMessage = (typeof ADMIN_ONLY_MESSAGE)[keyof typeof ADMIN_ONLY_MESSAGE];

// 403 unless the signed-in user is an admin. Call after requireSession.
export function requireAdmin(req: NextRequest, message: AdminOnlyMessage) {
  if (currentUser(req)?.role === ROLE.ADMIN) return null;
  return privateJson({ success: false, message }, { status: HTTP_STATUS.FORBIDDEN });
}
