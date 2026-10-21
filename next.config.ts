import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
// Validates every env var at dev start and build time (see src/env.ts).
import { env } from './src/env';
import { REMOTE_IMAGE_HOSTS } from './src/config/images';
import { securityHeaders } from './src/config/security-headers';

export default function nextConfig(phase: string): NextConfig {
  // NEXT_PUBLIC_IMAGE_LOADER picks who resizes images for next/image:
  //   (empty)    Next.js built-in optimizer: sharp runs on every server/pod, each with its own cache
  //   cloudflare Cloudflare Image Transformations at the edge (production only; dev uses built-in)
  //   none       no resizing at all (sharp never runs); images are served as committed,
  //              which the image policy (bun run images:check) keeps small WebP/AVIF
  const imageLoader = env.NEXT_PUBLIC_IMAGE_LOADER;
  const useCloudflareImages = imageLoader === 'cloudflare' && phase !== PHASE_DEVELOPMENT_SERVER;

  return {
    output: env.BUILD_STANDALONE ? 'standalone' : undefined,
    images: {
      // Serve AVIF where the browser supports it, WebP otherwise.
      formats: ['image/avif', 'image/webp'],
      // Keep optimized images for 31 days so pods re-run sharp less often.
      minimumCacheTTL: 60 * 60 * 24 * 31,
      unoptimized: imageLoader === 'none',
      ...(useCloudflareImages && { loader: 'custom', loaderFile: './src/lib/image-loader.ts' }),
      remotePatterns: REMOTE_IMAGE_HOSTS.map((host) => ({ ...host }))
    },
    poweredByHeader: false,
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders({
            isDev: phase === PHASE_DEVELOPMENT_SERVER,
            apiUrl: env.NEXT_PUBLIC_API_URL,
            imageHosts: REMOTE_IMAGE_HOSTS,
            cfImageBase: env.NEXT_PUBLIC_CF_IMAGE_BASE
          })
        }
      ];
    },
    transpilePackages: ['geist'],
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production'
    }
  };
}
