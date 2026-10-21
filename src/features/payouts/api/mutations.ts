import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { partnerKeys } from '@/features/partners/api/queries';
import { overviewKeys } from '@/features/overview/api/queries';
import { createPayout, updatePayout, deletePayout } from './service';
import { payoutKeys } from './queries';
import type { PayoutPayload } from './types';

// A payout changes partner totals and the overview KPIs too, so refresh all three.
function invalidatePayoutData() {
  const queryClient = getQueryClient();
  queryClient.invalidateQueries({ queryKey: payoutKeys.all });
  queryClient.invalidateQueries({ queryKey: partnerKeys.all });
  queryClient.invalidateQueries({ queryKey: overviewKeys.all });
}

export const createPayoutMutation = mutationOptions({
  mutationFn: (data: PayoutPayload) => createPayout(data),
  onSuccess: () => {
    invalidatePayoutData();
  }
});

export const updatePayoutMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: string; values: PayoutPayload }) => updatePayout(id, values),
  onSuccess: () => {
    invalidatePayoutData();
  }
});

export const deletePayoutMutation = mutationOptions({
  mutationFn: (id: string) => deletePayout(id),
  onSuccess: () => {
    invalidatePayoutData();
  }
});
