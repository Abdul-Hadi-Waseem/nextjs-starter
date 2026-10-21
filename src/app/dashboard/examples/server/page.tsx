import { redirect } from 'next/navigation';
import { EXAMPLE_ROUTES } from '@/features/examples/shared/constants/example-pages';

// Breadcrumb target for /dashboard/examples/server.
export default function Page() {
  redirect(EXAMPLE_ROUTES.SERVER_COMPONENT);
}
