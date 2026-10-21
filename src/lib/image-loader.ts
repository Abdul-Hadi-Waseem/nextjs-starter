// Cloudflare Image Transformations loader for next/image.
// Enabled in production when NEXT_PUBLIC_IMAGE_LOADER=cloudflare (see next.config.ts).
// Cloudflare resizes and converts at the edge, so the Next.js server does no image work.
// Requires Image Transformations enabled on the Cloudflare zone.

import { env } from '@/env';

const CF_BASE = env.NEXT_PUBLIC_CF_IMAGE_BASE ?? '';
const DEFAULT_QUALITY = 75;

type LoaderProps = { src: string; width: number; quality?: number };

export default function cloudflareLoader({ src, width, quality }: LoaderProps) {
  const options = [`width=${width}`, `quality=${quality ?? DEFAULT_QUALITY}`, 'format=auto'].join(
    ','
  );
  const source = src.startsWith('/') ? src.slice(1) : src;
  return `${CF_BASE}/cdn-cgi/image/${options}/${source}`;
}
