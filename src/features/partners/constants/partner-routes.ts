import { PAYOUT_ROUTES } from '@/features/payouts/constants/payout-routes';
import { PAYOUT_NEW_FLAG, PAYOUT_SEARCH_PARAM } from '@/features/payouts/constants/payout-table';

const PARTNERS_PATH = '/dashboard/partners';
const PAYOUTS_PATH = PAYOUT_ROUTES.list;

// Deep links into the payouts page use its own URL keys, so a rename there can't break them.
export const PARTNER_ROUTES = {
  list: PARTNERS_PATH,
  detail: (id: string) => `${PARTNERS_PATH}/${encodeURIComponent(id)}`,
  payouts: (id: string) =>
    `${PAYOUTS_PATH}?${new URLSearchParams({ [PAYOUT_SEARCH_PARAM.PARTNER]: id })}`,
  newPayout: (id: string) =>
    `${PAYOUTS_PATH}?${new URLSearchParams({
      [PAYOUT_SEARCH_PARAM.PARTNER]: id,
      [PAYOUT_SEARCH_PARAM.NEW]: PAYOUT_NEW_FLAG
    })}`
} as const;
