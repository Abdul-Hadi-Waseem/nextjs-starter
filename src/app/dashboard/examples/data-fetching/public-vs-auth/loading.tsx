import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { PublicVsAuthSkeleton } from '@/features/examples/data-fetching/components/public-vs-auth-view';

export default function Loading() {
  return (
    <ExamplePageShell page='publicVsAuth'>
      <PublicVsAuthSkeleton />
    </ExamplePageShell>
  );
}
