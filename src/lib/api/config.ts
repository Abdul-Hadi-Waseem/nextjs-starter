import { PUBLIC_ENV } from '@/lib/public-env';

// Backend base URL (validated in src/env.ts). Locally it points at this app's
// own mock route handlers (src/app/api).
export const API_URL = PUBLIC_ENV.API_URL;

export const AUTH = {
  enabled: PUBLIC_ENV.AUTH_ENABLED,
  signInPath: '/auth/sign-in',
  homePath: '/dashboard/overview'
} as const;

export const HTTP_STATUS = {
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  GATEWAY_TIMEOUT: 504
} as const;

/** Cache-Control values the backend (and the mock API) sends. */
export const CACHE_CONTROL = {
  // Shared by every user: a CDN keeps it 60 s, then serves it stale for up to 5 min
  // while it refetches in the background.
  PUBLIC: 'public, s-maxage=60, stale-while-revalidate=300',
  // Per-user: no CDN or browser cache may store it.
  PRIVATE: 'private, no-store'
} as const;
