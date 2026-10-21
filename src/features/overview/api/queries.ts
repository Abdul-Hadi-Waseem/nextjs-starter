import { queryOptions } from '@tanstack/react-query';
import { getOverview } from './service';
import type { OverviewSummary } from './types';

export type { OverviewSummary };

export const overviewKeys = {
  all: ['overview'] as const,
  summary: () => [...overviewKeys.all, 'summary'] as const
};

export const overviewQueryOptions = () =>
  queryOptions({
    queryKey: overviewKeys.summary(),
    queryFn: getOverview
  });
