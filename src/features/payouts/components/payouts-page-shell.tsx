import PageContainer from '@/components/layout/page-container';
import { NewPayoutButton } from './new-payout-button';

// Shared by page.tsx and loading.tsx, so the header doesn't move when data arrives.
export function PayoutsPageShell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer
      pageTitle='Payouts'
      pageDescription='Schedule, edit and track payments to partners.'
      pageHeaderAction={<NewPayoutButton />}
    >
      {children}
    </PageContainer>
  );
}
