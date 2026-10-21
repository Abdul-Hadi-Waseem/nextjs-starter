import 'server-only';
import { notFound, redirect } from 'next/navigation';
import { AUTH, isApiError } from '@/lib/api';
import type { PermissionCheck } from '@/types';
import { getMe } from '../api/service';
import { hasAccess } from './access';

/**
 * Page guard for server components: `await requireAccess({ role: ROLE.ADMIN })`.
 * Signed-out users go to sign-in; signed-in users without access get a 404.
 * The backend must still enforce the same rule on its endpoints.
 */
export async function requireAccess(check: PermissionCheck) {
  if (!AUTH.enabled) return;

  const me = await getMe().catch((error: unknown) => {
    if (isApiError(error) && error.isUnauthorized) redirect(AUTH.signInPath);
    throw error;
  });

  if (!hasAccess(me.user, check)) notFound();
}
