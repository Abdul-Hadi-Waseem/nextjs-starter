import { queryOptions } from '@tanstack/react-query';
import { getPayouts, getPayoutById } from './service';
import type { Payout, PayoutFilters } from './types';

export type { Payout };

export const payoutKeys = {
  all: ['payouts'] as const,
  list: (filters: PayoutFilters) => [...payoutKeys.all, 'list', filters] as const,
  detail: (id: string) => [...payoutKeys.all, 'detail', id] as const
};

export const payoutsQueryOptions = (filters: PayoutFilters) =>
  queryOptions({
    queryKey: payoutKeys.list(filters),
    queryFn: ({ signal }) => getPayouts(filters, signal)
  });

export const payoutByIdOptions = (id: string) =>
  queryOptions({
    queryKey: payoutKeys.detail(id),
    queryFn: ({ signal }) => getPayoutById(id, signal)
  });
