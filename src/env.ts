// Every environment variable, validated with zod. Imported by next.config.ts,
// so `bun run dev` and `bun run build` stop with a clear error when a variable
// is missing or invalid. Read env through `env` from here, never `process.env`.
// Server-only variables throw if client code tries to read them.

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const flag = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');

export const env = createEnv({
  server: {
    /** Name of the httpOnly session cookie the backend sets. */
    AUTH_COOKIE_NAME: z.string().min(1).default('access_token'),
    /** Turn the mock API (src/app/api) on in production. Demo deployments only. */
    ENABLE_MOCK_API: flag,
    /** Build Next.js standalone output (Docker). */
    BUILD_STANDALONE: flag
  },
  client: {
    /** Backend base URL. Required. Locally: http://localhost:3000/api (the mock API). */
    NEXT_PUBLIC_API_URL: z.url(),
    /** Public URL of this app, used for absolute Open Graph image URLs. */
    NEXT_PUBLIC_APP_URL: z.url().optional(),
    /** Require the session cookie for /dashboard. */
    NEXT_PUBLIC_AUTH_ENABLED: flag,
    /** Who resizes next/image images: unset = Next.js, "cloudflare", or "none". */
    NEXT_PUBLIC_IMAGE_LOADER: z.enum(['cloudflare', 'none']).optional(),
    /** Origin for Cloudflare image transforms. Default: same origin. */
    NEXT_PUBLIC_CF_IMAGE_BASE: z.url().optional()
  },
  runtimeEnv: {
    AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME,
    ENABLE_MOCK_API: process.env.ENABLE_MOCK_API,
    BUILD_STANDALONE: process.env.BUILD_STANDALONE,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_AUTH_ENABLED: process.env.NEXT_PUBLIC_AUTH_ENABLED,
    NEXT_PUBLIC_IMAGE_LOADER: process.env.NEXT_PUBLIC_IMAGE_LOADER,
    NEXT_PUBLIC_CF_IMAGE_BASE: process.env.NEXT_PUBLIC_CF_IMAGE_BASE
  },
  // `KEY=` in an env file counts as unset, so defaults and .optional() apply.
  emptyStringAsUndefined: true
});
