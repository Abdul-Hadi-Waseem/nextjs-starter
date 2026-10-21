import { env } from '@/env';

// Backend base URL (validated in src/env.ts). Locally it points at this app's
// own mock route handlers (src/app/api).
export const API_URL = env.NEXT_PUBLIC_API_URL;

export const AUTH = {
  enabled: env.NEXT_PUBLIC_AUTH_ENABLED,
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
