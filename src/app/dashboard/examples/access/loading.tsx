import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { AccessDemoSkeleton } from '@/features/examples/access/components/access-demo';

export default function Loading() {
  return (
    <ExamplePageShell page='access'>
      <AccessDemoSkeleton />
    </ExamplePageShell>
  );
}
