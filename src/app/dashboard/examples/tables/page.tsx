import { redirect } from 'next/navigation';
import { PRODUCT_ROUTES } from '@/features/examples/tables/products/constants/product-routes';

// Breadcrumb target for /dashboard/examples/tables.
export default function Page() {
  redirect(PRODUCT_ROUTES.list);
}
