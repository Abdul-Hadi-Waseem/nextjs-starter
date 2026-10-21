'use server';

import { updateTag } from 'next/cache';
import { EXCHANGE_RATES_CACHE } from '../../shared/constants/cache';
import { getSessionUser } from '../../shared/api/server';

export async function refreshExchangeRates() {
  // Server actions are public POST endpoints: check the session, don't trust the UI.
  if (!(await getSessionUser())) return { ok: false };

  // updateTag expires the entry now and this action's response re-renders the page
  // with fresh data. From a webhook or route handler, use revalidateTag(tag, 'max').
  updateTag(EXCHANGE_RATES_CACHE.tag);
  return { ok: true };
}
