// Security headers for every response, applied in next.config.ts `headers()`.
//
// The CSP is static (no per-request nonce), so scripts need 'unsafe-inline':
// Next.js injects inline scripts to hydrate the page. For a stricter policy,
// switch to a nonce-based CSP in src/proxy.ts (every page here is already
// dynamically rendered). See node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md.

// Third-party origins the browser talks to directly. Remove the demo ones
// (pokeapi.co is only used by the React Query demo page) when you delete demos.
const EXTRA_CONNECT_SRC = ['https://pokeapi.co'];

type Options = {
  isDev: boolean;
  apiUrl?: string;
  imageHosts: readonly { protocol: string; hostname: string }[];
  cfImageBase?: string;
};

function originOf(url?: string) {
  if (!url) return undefined;
  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
}

export function buildCsp({ isDev, apiUrl, imageHosts, cfImageBase }: Options) {
  const imageOrigins = imageHosts.map(({ protocol, hostname }) => `${protocol}://${hostname}`);
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    // 'unsafe-eval' only in dev: React uses eval for better error stacks.
    'script-src': ["'self'", "'unsafe-inline'", ...(isDev ? ["'unsafe-eval'"] : [])],
    // Inline styles: style props (charts, skeletons) and libraries that set them.
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', ...imageOrigins, originOf(cfImageBase)].filter(
      (value): value is string => Boolean(value)
    ),
    'font-src': ["'self'"],
    'connect-src': ["'self'", originOf(apiUrl), ...EXTRA_CONNECT_SRC].filter(
      (value): value is string => Boolean(value)
    ),
    // Dev tools (React Scan) draw from a blob: web worker; production allows none.
    'worker-src': ["'self'", ...(isDev ? ['blob:'] : [])],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"]
  };

  const policy = Object.entries(directives).map(
    ([name, values]) => `${name} ${[...new Set(values)].join(' ')}`
  );
  if (!isDev) policy.push('upgrade-insecure-requests');
  return policy.join('; ');
}

export function securityHeaders(options: Options) {
  const headers = [
    { key: 'Content-Security-Policy', value: buildCsp(options) },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
  ];
  // HSTS only over HTTPS in production; in dev it would pin localhost to HTTPS.
  if (!options.isDev) {
    headers.push({
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains'
    });
  }
  return headers;
}
