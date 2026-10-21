import { clearSessionCookie } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { privateJson } from '@/app/api/_mock/cache-control';

export async function POST() {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  return clearSessionCookie(privateJson({ success: true }));
}
