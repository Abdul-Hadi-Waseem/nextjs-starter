'use client';

import { lazy, Suspense, useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { AreaGraphSkeleton } from './area-graph-skeleton';
import { BarGraphSkeleton } from './bar-graph-skeleton';
import { PieGraphSkeleton } from './pie-graph-skeleton';

// Recharts (~100 KB gzipped) stays out of the overview page's first-load JS.
// The server renders the skeleton; after hydration the chart chunk loads and
// replaces it. (`next/dynamic` with `ssr: false` inside these server-rendered
// parallel-route slots made the server bail out of the boundary and sent
// `next dev` into a reload loop, so this mounts the chart client-side instead.)
function clientOnly(load: () => Promise<ComponentType>, skeleton: ReactNode) {
  const Chart = lazy(async () => ({ default: await load() }));

  return function ClientOnlyChart() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return skeleton;
    return (
      <Suspense fallback={skeleton}>
        <Chart />
      </Suspense>
    );
  };
}

export const AreaGraph = clientOnly(
  () => import('./area-graph').then((m) => m.AreaGraph),
  <AreaGraphSkeleton />
);

export const BarGraph = clientOnly(
  () => import('./bar-graph').then((m) => m.BarGraph),
  <BarGraphSkeleton />
);

export const PieGraph = clientOnly(
  () => import('./pie-graph').then((m) => m.PieGraph),
  <PieGraphSkeleton />
);
