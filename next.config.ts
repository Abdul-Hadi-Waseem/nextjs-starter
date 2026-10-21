import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

export default function nextConfig(phase: string): NextConfig {
  // NEXT_PUBLIC_IMAGE_LOADER picks who resizes images for next/image:
  //   (empty)    Next.js built-in optimizer: sharp runs on every server/pod, each with its own cache
  //   cloudflare Cloudflare Image Transformations at the edge (production only; dev uses built-in)
  //   none       no resizing at all (sharp never runs); images are served as committed,
  //              which the image policy (bun run images:check) keeps small WebP/AVIF
  const imageLoader = process.env.NEXT_PUBLIC_IMAGE_LOADER;
  const useCloudflareImages = imageLoader === 'cloudflare' && phase !== PHASE_DEVELOPMENT_SERVER;

  return {
    output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
    images: {
      // Serve AVIF where the browser supports it, WebP otherwise.
      formats: ['image/avif', 'image/webp'],
      // Keep optimized images for 31 days so pods re-run sharp less often.
      minimumCacheTTL: 60 * 60 * 24 * 31,
      unoptimized: imageLoader === 'none',
      ...(useCloudflareImages && { loader: 'custom', loaderFile: './src/lib/image-loader.ts' }),
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'api.slingacademy.com',
          port: ''
        },
        {
          protocol: 'https',
          hostname: 'raw.githubusercontent.com',
          pathname: '/PokeAPI/sprites/**'
        }
      ]
    },
    transpilePackages: ['geist'],
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production'
    }
  };
}
