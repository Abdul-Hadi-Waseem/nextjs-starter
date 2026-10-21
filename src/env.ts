// Every environment variable, validated with zod. Imported by next.config.ts,
// so `bun run dev` and `bun run build` stop with a clear error when a variable
// is missing or invalid. Server code reads env through `env` from here; browser
// code uses PUBLIC_ENV (src/lib/public-env.ts) so zod stays out of the bundle.
// Server-only variables throw if client code tries to read them.

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const flag = (fallback: 'true' | 'false' = 'false') =>
  z
    .enum(['true', 'false'])
    .default(fallback)
    .transform((value) => value === 'true');

// This app's own dev origin, to catch NEXT_PUBLIC_API_URL pointing at the pages, not /api.
const LOCAL_APP = {
  hosts: ['localhost', '127.0.0.1'],
  port: '3000'
} as const;

export const env = createEnv({
  // Readable on server and client. Next.js sets NODE_ENV itself (`dev` → development, `build` → production).
  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
  },
  server: {
    /** Name of the httpOnly session cookie the backend sets. */
    AUTH_COOKIE_NAME: z.string().min(1).default('access_token'),
    /** Turn the mock API (src/app/api) on in production. Demo deployments only. */
    ENABLE_MOCK_API: flag(),
    /** Build Next.js standalone output (Docker). */
    BUILD_STANDALONE: flag(),
    /** Secret the BFF route handler adds to backend calls (examples/server/route-handler). Never NEXT_PUBLIC_. */
    BACKEND_API_KEY: z.string().min(1).optional()
  },
  client: {
    /** Backend base URL. Required. Locally: http://localhost:3000/api (the mock API). */
    NEXT_PUBLIC_API_URL: z.url().refine(
      (value) => {
        // A malformed URL is already reported by z.url(); zod 4 still runs this refine.
        if (!URL.canParse(value)) return true;
        const url = new URL(value);
        const pointsAtThisApp =
          LOCAL_APP.hosts.some((host) => host === url.hostname) && url.port === LOCAL_APP.port;
        return !pointsAtThisApp || url.pathname.startsWith('/api');
      },
      { message: 'Points at this app, not an API. Use http://localhost:3000/api for the mock API.' }
    ),
    /** Public URL of this app, used for absolute Open Graph image URLs. */
    NEXT_PUBLIC_APP_URL: z.url().optional(),
    /** Require the session cookie for /dashboard. On unless explicitly "false". */
    NEXT_PUBLIC_AUTH_ENABLED: flag('true'),
    /** Who resizes next/image images: unset = Next.js, "cloudflare", or "none". */
    NEXT_PUBLIC_IMAGE_LOADER: z.enum(['cloudflare', 'none']).optional(),
    /** Origin for Cloudflare image transforms. Default: same origin. */
    NEXT_PUBLIC_CF_IMAGE_BASE: z.url().optional(),
    /** Dev only debug mode (`bun run dev:scan`): React Scan outlines + React Query devtools. */
    NEXT_PUBLIC_REACT_SCAN: flag()
  },
  // Next inlines NEXT_PUBLIC_* only when written out literally, so client and shared vars are
  // listed here. Server vars are read from process.env at runtime and need no entry.
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_AUTH_ENABLED: process.env.NEXT_PUBLIC_AUTH_ENABLED,
    NEXT_PUBLIC_IMAGE_LOADER: process.env.NEXT_PUBLIC_IMAGE_LOADER,
    NEXT_PUBLIC_CF_IMAGE_BASE: process.env.NEXT_PUBLIC_CF_IMAGE_BASE,
    NEXT_PUBLIC_REACT_SCAN: process.env.NEXT_PUBLIC_REACT_SCAN
  },
  // `KEY=` in an env file counts as unset, so defaults and .optional() apply.
  emptyStringAsUndefined: true
});
