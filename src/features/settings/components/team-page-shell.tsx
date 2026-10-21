import PageContainer from '@/components/layout/page-container';
import { InviteMemberButton } from './invite-member-button';

// Shared by page.tsx and loading.tsx, so the header doesn't move when data arrives.
export function TeamPageShell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer
      pageTitle='Team'
      pageDescription='Everyone who can sign in to this dashboard, and their role. Only admins can see this page.'
      pageHeaderAction={<InviteMemberButton />}
    >
      {children}
    </PageContainer>
  );
}
