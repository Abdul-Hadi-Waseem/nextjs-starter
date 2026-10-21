import { PayoutsPageShell } from '@/features/payouts/components/payouts-page-shell';
import { PayoutsTableSkeleton } from '@/features/payouts/components/payouts-table-skeleton';

export default function Loading() {
  return (
    <PayoutsPageShell>
      <PayoutsTableSkeleton />
    </PayoutsPageShell>
  );
}
