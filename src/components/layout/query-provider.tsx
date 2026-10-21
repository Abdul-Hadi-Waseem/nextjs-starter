'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/lib/query-client';
import { PUBLIC_ENV } from '@/lib/public-env';
import type * as React from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Debug mode only (`bun run dev:scan`), so the floating button stays out of the way. */}
      {PUBLIC_ENV.DEBUG_TOOLS && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
