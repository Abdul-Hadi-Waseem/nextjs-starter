import { TeamMembersSkeleton } from '@/features/settings/components/team-members-skeleton';
import { TeamPageShell } from '@/features/settings/components/team-page-shell';

export default function Loading() {
  return (
    <TeamPageShell>
      <TeamMembersSkeleton />
    </TeamPageShell>
  );
}
