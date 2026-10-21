import { UserListing } from '@/features/examples/tables/users/components/user-listing';
import { UsersPageShell } from '@/features/examples/tables/users/components/users-page-shell';
import { searchParamsCache } from '@/features/examples/shared/lib/table-search-params';
import type { SearchParams } from 'nuqs/server';
import { ROLE } from '@/features/auth/constants/auth';
import { requireAccess } from '@/features/auth/lib/require-access';

export const metadata = {
  title: 'Users'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function UsersPage(props: PageProps) {
  await requireAccess({ role: ROLE.ADMIN });

  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <UsersPageShell>
      <UserListing />
    </UsersPageShell>
  );
}
