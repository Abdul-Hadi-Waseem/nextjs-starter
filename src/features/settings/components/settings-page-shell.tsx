import PageContainer from '@/components/layout/page-container';

// Shared by page.tsx and loading.tsx, so the header doesn't move when data arrives.
export function SettingsPageShell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer
      pageTitle='Settings'
      pageDescription='Your profile, and how the dashboard looks in this browser.'
    >
      {children}
    </PageContainer>
  );
}
