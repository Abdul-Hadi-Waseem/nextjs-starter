import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { ProductsPageShell } from '@/features/products/components/products-page-shell';

export default function Loading() {
  return (
    <ProductsPageShell>
      <DataTableSkeleton columnCount={6} rowCount={10} filterCount={2} />
    </ProductsPageShell>
  );
}
