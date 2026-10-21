import PageContainer from '@/components/layout/page-container';

// Shared by page.tsx and loading.tsx, so the header doesn't move when data arrives.
export function PartnersPageShell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer
      pageTitle='Partners'
      pageDescription='Everyone you pay out to, with their tier and status.'
    >
      {children}
    </PageContainer>
  );
}
