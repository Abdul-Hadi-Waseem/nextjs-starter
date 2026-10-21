'use client';

import { lazy, Suspense, useEffect, useState, type ComponentType, type ReactNode } from 'react';

// Recharts (~100 KB gzipped) stays out of the overview page's first-load JS.
// The server renders the plot placeholder; after hydration the chart chunk loads
// and replaces it with a short fade (motion-safe), so the plot doesn't snap in.
// (`next/dynamic` with `ssr: false` inside server-rendered sections made the server
// bail out of the boundary and sent `next dev` into a reload loop, so this mounts
// the chart client-side instead.) The fallback is only the plot area: the card and
// its header are already real.
//
// Each section wraps its own chart with this, next to where it's used, so each
// chart's code is its own chunk and loads only where it's drawn.
export function clientOnly<P extends object>(
  load: () => Promise<ComponentType<P>>,
  fallback: ReactNode
) {
  // Start the chunk download as soon as the section module runs in the browser (when
  // the route's JS loads), not when the card mounts, so the chart is usually ready
  // by the time the data arrives. Once loaded it renders directly: suspending on an
  // already-loaded lazy() still shows the fallback, and React throttles that reveal
  // by ~300ms, which made the placeholder flash.
  let Loaded: ComponentType<P> | undefined;
  let chunk: Promise<{ default: ComponentType<P> }> | undefined;
  const loadChunk = () =>
    (chunk ??= load().then(
      (component) => {
        Loaded = component;
        return { default: component };
      },
      (error: unknown) => {
        // Forget a failed download so a retry (error.tsx "Try again") fetches it again.
        chunk = undefined;
        throw error;
      }
    ));
  // A failure here surfaces when the chart renders (lazy rethrows it), not as an unhandled rejection.
  if (typeof window !== 'undefined') loadChunk().catch(() => undefined);
  const Chart = lazy(loadChunk);

  return function ClientOnlyChart(props: P) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return fallback;
    return (
      <div className='motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-150'>
        {Loaded ? (
          <Loaded {...props} />
        ) : (
          <Suspense fallback={fallback}>
            <Chart {...props} />
          </Suspense>
        )}
      </div>
    );
  };
}
