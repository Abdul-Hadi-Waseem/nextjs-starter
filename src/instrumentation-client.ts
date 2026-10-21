// Runs in the browser before the app becomes interactive.

// React Scan (dev only, opt-in): outlines components as they re-render and
// counts renders, so unnecessary re-renders are visible. Start with
// `bun run dev:scan`. The NODE_ENV check removes this from production builds.
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_REACT_SCAN === 'true') {
  void import('react-scan').then(({ scan }) => scan({ enabled: true }));
}
