import { redirect } from 'next/navigation';
import { EXAMPLE_ROUTES } from '@/features/examples/shared/constants/example-pages';

// Breadcrumb target for /dashboard/examples/data-fetching.
export default function Page() {
  redirect(EXAMPLE_ROUTES.REACT_QUERY);
}
