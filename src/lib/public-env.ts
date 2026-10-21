// Public (NEXT_PUBLIC_*) env values for code that runs in the browser.
//
// They're validated by src/env.ts, which next.config.ts imports, so a bad value
// already stops `bun run dev` / `bun run build`. Next.js inlines these at build
// time; reading them here instead of importing `env` keeps zod and t3-env
// (~36 KB gzipped) out of every page. Keep the defaults in sync with src/env.ts.
export const PUBLIC_ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
  AUTH_ENABLED: process.env.NEXT_PUBLIC_AUTH_ENABLED !== 'false',
  CF_IMAGE_BASE: process.env.NEXT_PUBLIC_CF_IMAGE_BASE || undefined,
  DEBUG_TOOLS: process.env.NEXT_PUBLIC_REACT_SCAN === 'true'
} as const;
