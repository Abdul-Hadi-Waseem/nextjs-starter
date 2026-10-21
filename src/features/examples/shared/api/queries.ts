import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { payoutKeys } from '@/features/payouts/api/queries';
import { getPayouts } from '@/features/payouts/api/service';
import { hasNextPage } from '@/lib/pagination';
import { ACCOUNT_QUERY_CACHE } from '../constants/cache';
import { EXAMPLE_PAGE_SIZE } from '../constants/demo';
import { getAccount, getAccountViaProxy, getChecklist, getExchangeRates } from './service';

export const exampleKeys = {
  all: ['examples'] as const,
  exchangeRates: () => [...exampleKeys.all, 'exchange-rates'] as const,
  account: () => [...exampleKeys.all, 'account'] as const,
  accountViaProxy: () => [...exampleKeys.all, 'account', 'proxy'] as const,
  checklist: () => [...exampleKeys.all, 'checklist'] as const
};

export const exchangeRatesQueryOptions = () =>
  queryOptions({
    queryKey: exampleKeys.exchangeRates(),
    queryFn: ({ signal }) => getExchangeRates(signal)
  });

// Per-user data: cached in this browser only, never in a shared server cache.
export const accountQueryOptions = () =>
  queryOptions({
    queryKey: exampleKeys.account(),
    queryFn: ({ signal }) => getAccount(signal),
    staleTime: ACCOUNT_QUERY_CACHE.staleTime,
    gcTime: ACCOUNT_QUERY_CACHE.gcTime
  });

export const accountViaProxyQueryOptions = () =>
  queryOptions({
    queryKey: exampleKeys.accountViaProxy(),
    queryFn: ({ signal }) => getAccountViaProxy(signal)
  });

export const checklistQueryOptions = () =>
  queryOptions({
    queryKey: exampleKeys.checklist(),
    queryFn: ({ signal }) => getChecklist(signal)
  });

// Keyed under payoutKeys.all, so invalidating payouts after a write refreshes this list too.
export const payoutsInfiniteQueryOptions = () =>
  infiniteQueryOptions({
    queryKey: [...payoutKeys.all, 'infinite', EXAMPLE_PAGE_SIZE] as const,
    queryFn: ({ pageParam, signal }) =>
      getPayouts({ page: pageParam, limit: EXAMPLE_PAGE_SIZE }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      hasNextPage(lastPage, lastPage.total_payouts) ? lastPageParam + 1 : undefined
  });
