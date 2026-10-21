import { NextResponse, type NextRequest } from 'next/server';
import { AUTH, HTTP_STATUS } from '@/lib/api/config';
import { mockUser, sessionUser } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';

export async function GET(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const user = sessionUser(request);
  if (user) return NextResponse.json({ success: true, user });

  // With auth disabled the demo still has a user to show.
  if (!AUTH.enabled) {
    return NextResponse.json({ success: true, user: mockUser('admin@example.com') });
  }

  return NextResponse.json(
    { success: false, message: 'Not authenticated' },
    { status: HTTP_STATUS.UNAUTHORIZED }
  );
}
