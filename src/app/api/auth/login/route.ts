import type { NextRequest } from 'next/server';
import { mockUser, setSessionCookie } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { parseBody } from '@/app/api/_mock/validation';
import { loginSchema } from '@/features/auth/schemas/login';
import { privateJson } from '@/app/api/_mock/cache-control';

// Mock login: accepts any email + password. A real backend verifies the
// credentials and sets its own httpOnly cookie.
export async function POST(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;

  const { data: body, error } = await parseBody(request, loginSchema);
  if (error) return error;

  return setSessionCookie(privateJson({ success: true, user: mockUser(body.email) }), body.email);
}
