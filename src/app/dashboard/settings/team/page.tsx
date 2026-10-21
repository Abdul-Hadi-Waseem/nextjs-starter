import type { Metadata } from 'next';
import { ROLE } from '@/features/auth/constants/auth';
import { requireAccess } from '@/features/auth/lib/require-access';
import { TeamListing } from '@/features/settings/components/team-listing';
import { TeamPageShell } from '@/features/settings/components/team-page-shell';

export const metadata: Metadata = {
  title: 'Team'
};

export default async function TeamPage() {
  // Members get a 404, signed-out users go to sign-in. /api/team enforces the same rule.
  await requireAccess({ role: ROLE.ADMIN });

  return (
    <TeamPageShell>
      <TeamListing />
    </TeamPageShell>
  );
}
