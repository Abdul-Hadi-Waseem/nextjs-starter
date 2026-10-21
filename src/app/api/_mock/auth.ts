// Mock-backend auth helpers. A real backend replaces all of this.
import { NextResponse, type NextRequest } from 'next/server';
import { AUTH, HTTP_STATUS } from '@/lib/api/config';

import { ROLE, type Role } from '@/features/auth/constants';
import type { AuthUser } from '@/features/auth/api/types';
import { env } from '@/env';

const MOCK_TOKEN_PREFIX = 'mock-session:';
const PERMISSIONS: Record<Role, string[]> = {
  [ROLE.ADMIN]: ['users:read', 'users:write', 'products:write'],
  [ROLE.MEMBER]: ['products:write']
};

// Mock rule: emails starting with "admin" sign in as admin, everyone else as member.
export function mockUser(email: string): AuthUser {
  const role = email.startsWith('admin') ? ROLE.ADMIN : ROLE.MEMBER;
  return { id: 1, name: 'Demo User', email, role, permissions: PERMISSIONS[role] };
}

export function sessionUser(req: NextRequest): AuthUser | null {
  const token = req.cookies.get(env.AUTH_COOKIE_NAME)?.value;
  if (!token?.startsWith(MOCK_TOKEN_PREFIX)) return null;
  return mockUser(decodeURIComponent(token.slice(MOCK_TOKEN_PREFIX.length)));
}
const ONE_DAY_SECONDS = 60 * 60 * 24;

export function setSessionCookie(res: NextResponse, email: string) {
  res.cookies.set(env.AUTH_COOKIE_NAME, MOCK_TOKEN_PREFIX + encodeURIComponent(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
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
  return NextResponse.json(
    { success: false, message: 'Not authenticated' },
    { status: HTTP_STATUS.UNAUTHORIZED }
  );
}
