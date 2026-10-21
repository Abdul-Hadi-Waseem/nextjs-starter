// Backend base URL. Defaults to this app's own mock route handlers (src/app/api),
// so the demo runs without a backend. Point it at your real API in .env.local.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export const AUTH = {
  enabled: process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true',
  cookieName: process.env.AUTH_COOKIE_NAME ?? 'access_token',
  signInPath: '/auth/sign-in',
  homePath: '/dashboard/overview'
} as const;

export const HTTP_STATUS = {
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;
