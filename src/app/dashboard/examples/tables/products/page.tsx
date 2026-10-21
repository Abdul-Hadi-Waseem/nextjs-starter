import { ProductListing } from '@/features/examples/tables/products/components/product-listing';
import { ProductsPageShell } from '@/features/examples/tables/products/components/products-page-shell';
import { searchParamsCache } from '@/features/examples/shared/lib/table-search-params';
import { SearchParams } from 'nuqs/server';

export const metadata = {
  title: 'Products'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <ProductsPageShell>
      <ProductListing />
    </ProductsPageShell>
  );
}
