import PageContainer from '@/components/layout/page-container';
import { usersInfoContent } from '@/features/users/info-content';
import { UserFormSheetTrigger } from './user-form-sheet';

// Shared by page.tsx and loading.tsx, so the header doesn't move when data arrives.
export function UsersPageShell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer
      pageTitle='Users'
      pageDescription='Manage users (React Query + nuqs table pattern.)'
      infoContent={usersInfoContent}
      pageHeaderAction={<UserFormSheetTrigger />}
    >
      {children}
    </PageContainer>
  );
}
