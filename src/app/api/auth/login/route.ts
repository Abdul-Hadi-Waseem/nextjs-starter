import { NextResponse, type NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/lib/api/config';
import { mockUser, setSessionCookie } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';

// Mock login: accepts any email + password. A real backend verifies the
// credentials and sets its own httpOnly cookie.
export async function POST(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { success: false, message: 'Email and password are required' },
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }

  return setSessionCookie(
    NextResponse.json({ success: true, user: mockUser(body.email) }),
    body.email
  );
}
