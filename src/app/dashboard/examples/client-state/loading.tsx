import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { ClientStateView } from '@/features/examples/client-state/components/client-state-view';

export default function Loading() {
  return (
    <ExamplePageShell page='clientState'>
      <ClientStateView />
    </ExamplePageShell>
  );
}
