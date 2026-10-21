import PageContainer from '@/components/layout/page-container';

// Shared by page.tsx, loading.tsx and error.tsx, so the header never moves.
export function OverviewPageShell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer
      pageTitle='Overview'
      pageDescription='Partner activity and payouts for the last 12 months.'
    >
      {children}
    </PageContainer>
  );
}
