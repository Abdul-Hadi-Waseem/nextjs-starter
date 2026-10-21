import type { SearchParams } from 'nuqs/server';
import { ExamplePageShell } from '@/features/examples/shared/components/example-page-shell';
import { EXAMPLE_PAGES } from '@/features/examples/shared/constants/example-pages';
import { PaginationView } from '@/features/examples/data-fetching/components/pagination-view';
import { paginationSearchParamsCache } from '@/features/examples/data-fetching/lib/search-params';

export const metadata = { title: EXAMPLE_PAGES.pagination.title };

type PageProps = { searchParams: Promise<SearchParams> };

export default async function Page(props: PageProps) {
  paginationSearchParamsCache.parse(await props.searchParams);

  return (
    <ExamplePageShell page='pagination'>
      <PaginationView />
    </ExamplePageShell>
  );
}
