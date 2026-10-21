import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { PaginationSkeleton } from '@/features/examples/data-fetching/components/pagination-view';

export default function Loading() {
  return (
    <ExamplePageShell page='pagination'>
      <PaginationSkeleton />
    </ExamplePageShell>
  );
}
