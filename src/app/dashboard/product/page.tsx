import ProductListingPage from '@/features/products/components/product-listing';
import { ProductsPageShell } from '@/features/products/components/products-page-shell';
import { searchParamsCache } from '@/lib/searchparams';
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
      <ProductListingPage />
    </ProductsPageShell>
  );
}
