import { queryOptions } from '@tanstack/react-query';
import { getPartners, getPartnerById } from './service';
import type { Partner, PartnerFilters } from './types';

export type { Partner };

export const partnerKeys = {
  all: ['partners'] as const,
  list: (filters: PartnerFilters) => [...partnerKeys.all, 'list', filters] as const,
  detail: (id: string) => [...partnerKeys.all, 'detail', id] as const
};

export const partnersQueryOptions = (filters: PartnerFilters) =>
  queryOptions({
    queryKey: partnerKeys.list(filters),
    queryFn: ({ signal }) => getPartners(filters, signal)
  });

export const partnerByIdOptions = (id: string) =>
  queryOptions({
    queryKey: partnerKeys.detail(id),
    queryFn: ({ signal }) => getPartnerById(id, signal)
  });
