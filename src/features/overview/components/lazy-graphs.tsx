'use client';

import dynamic from 'next/dynamic';
import { AreaGraphSkeleton } from './area-graph-skeleton';
import { BarGraphSkeleton } from './bar-graph-skeleton';
import { PieGraphSkeleton } from './pie-graph-skeleton';

// Recharts (~100 KB gzipped) loads in its own chunk instead of the overview
// page's first-load JS. Charts render on the client only, behind their skeletons.
export const AreaGraph = dynamic(() => import('./area-graph').then((m) => m.AreaGraph), {
  ssr: false,
  loading: () => <AreaGraphSkeleton />
});

export const BarGraph = dynamic(() => import('./bar-graph').then((m) => m.BarGraph), {
  ssr: false,
  loading: () => <BarGraphSkeleton />
});

export const PieGraph = dynamic(() => import('./pie-graph').then((m) => m.PieGraph), {
  ssr: false,
  loading: () => <PieGraphSkeleton />
});
