import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { AdminOnlyCard } from '@/features/examples/access/components/admin-only-card';
import { ADMIN_ACCESS } from '@/features/examples/access/constants/access-checks';
import { requireAccess } from '@/features/auth/lib/require-access';

export const metadata = { title: EXAMPLE_PAGES.accessAdmin.title };

export default async function Page() {
  // Members get a 404, signed-out users go to sign-in. Same check as the nav item's `access`.
  await requireAccess(ADMIN_ACCESS);

  return (
    <ExamplePageShell page='accessAdmin'>
      <AdminOnlyCard />
    </ExamplePageShell>
  );
}
