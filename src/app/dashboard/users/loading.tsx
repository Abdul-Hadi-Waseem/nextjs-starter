import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { UsersPageShell } from '@/features/users/components/users-page-shell';

export default function Loading() {
  return (
    <UsersPageShell>
      <DataTableSkeleton columnCount={6} rowCount={10} filterCount={2} />
    </UsersPageShell>
  );
}
