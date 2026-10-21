import PageContainer from '@/components/layout/page-container';
import { usersInfoContent } from '@/features/examples/tables/users/constants/info-content';
import { UserFormSheetTrigger } from './user-form-sheet';

// Shared by page.tsx and loading.tsx, so the header doesn't move when data arrives.
export function UsersPageShell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer
      pageTitle='Users'
      pageDescription='TanStack Table with URL state and a sheet form.'
      infoContent={usersInfoContent}
      pageHeaderAction={<UserFormSheetTrigger />}
    >
      {children}
    </PageContainer>
  );
}
