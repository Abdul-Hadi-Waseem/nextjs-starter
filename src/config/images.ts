// Remote image hosts, used for next/image `remotePatterns` and the CSP `img-src`.
// Add a host here (not in next.config.ts) so both stay in sync.
export const REMOTE_IMAGE_HOSTS = [
  { protocol: 'https', hostname: 'api.slingacademy.com' },
  { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '/PokeAPI/sprites/**' }
] as const;
