// Signed-in example endpoint: answers with the caller's own account.
import type { NextRequest } from 'next/server';
import { currentUser, notAuthenticated, requireSession } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { delay, MOCK_DELAY } from '@/app/api/_mock/db/utils';
import { privateJson } from '@/app/api/_mock/cache-control';

export async function GET(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  const user = currentUser(request);
  // A cookie that isn't a valid session.
  if (!user) {
    return notAuthenticated();
  }

  await delay(MOCK_DELAY.DETAIL);
  const { name, email, role } = user;
  return privateJson({ name, email, role, fetchedAt: new Date().toISOString() });
}
