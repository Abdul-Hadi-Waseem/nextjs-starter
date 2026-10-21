// Server-only calls for the server-side examples. `api` forwards the incoming
// request's cookies, so the httpOnly token never reaches the browser.
import 'server-only';
import { redirect } from 'next/navigation';
import { getMe } from '@/features/auth/api/service';
import { isApiError, signInUrl } from '@/lib/api';
import { getAccount } from './service';

/**
 * For async server components: a 401 means the session is gone, so go to sign-in and
 * come back to `currentPath` afterwards. Server components can't read their own URL,
 * so the page passes it; signInUrl drops it unless it is a safe relative path.
 */
export async function getAccountOrSignIn(currentPath?: string) {
  return getAccount().catch((error: unknown) => {
    if (isApiError(error) && error.isUnauthorized) redirect(signInUrl(currentPath));
    throw error;
  });
}

/** For server actions: the signed-in user, or null when there is no valid session. */
export async function getSessionUser() {
  try {
    const { user } = await getMe();
    return user;
  } catch (error) {
    if (isApiError(error) && error.isUnauthorized) return null;
    throw error;
  }
}
