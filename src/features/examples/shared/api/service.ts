// ============================================================
// Examples service: the only file the example pages use to talk to the backend.
// Everything goes through `api` (src/lib/api). Out of the box these hit the mock
// routes in src/app/api/examples.
// ============================================================

import { api } from '@/lib/api';
import { EXCHANGE_RATES_CACHE } from '../constants/cache';
import { FAIL_QUERY } from '../constants/demo';
import type {
  AccountSummary,
  AddChecklistItem,
  ChecklistItem,
  ChecklistResponse,
  ExchangeRates,
  ToggleChecklistItem
} from './types';

const failQuery = (fail: boolean) => (fail ? FAIL_QUERY : undefined);

// Public endpoint: no cookie sent, from the server or the browser.
export async function getExchangeRates(signal?: AbortSignal) {
  return api.get<ExchangeRates>('/examples/exchange-rates', { auth: false, signal });
}

// Server components only: the same public call, kept in Next.js's data cache for
// 60 s and tagged so a server action can refresh it. Safe because no cookie is sent,
// so every user gets the same answer.
export async function getCachedExchangeRates() {
  return api.get<ExchangeRates>('/examples/exchange-rates', {
    auth: false,
    next: { revalidate: EXCHANGE_RATES_CACHE.revalidateSeconds, tags: [EXCHANGE_RATES_CACHE.tag] }
  });
}

// Signed-in endpoint: the cookie goes along (browser) or is forwarded (server).
export async function getAccount(signal?: AbortSignal) {
  return api.get<AccountSummary>('/examples/account', { signal });
}

// The same signed-in endpoint without the cookie, to show what a signed-out caller gets.
export async function getAccountWithoutCookie() {
  return api.get<AccountSummary>('/examples/account', { auth: false });
}

// Through the BFF route handler (src/app/api/examples/proxy), which adds the server-only
// secret. That route lives in this app; here NEXT_PUBLIC_API_URL is this app's /api.
export async function getAccountViaProxy(signal?: AbortSignal) {
  return api.get<AccountSummary>('/examples/proxy/account', { signal });
}

export async function getChecklist(signal?: AbortSignal) {
  return api.get<ChecklistResponse>('/examples/checklist', { signal });
}

export async function setChecklistItemDone({ id, done, fail }: ToggleChecklistItem) {
  return api.patch<{ item: ChecklistItem }>(`/examples/checklist/${encodeURIComponent(id)}`, {
    body: { done },
    query: failQuery(fail)
  });
}

export async function addChecklistItem({ title, fail }: AddChecklistItem) {
  return api.post<{ item: ChecklistItem }>('/examples/checklist', {
    body: { title },
    query: failQuery(fail)
  });
}
