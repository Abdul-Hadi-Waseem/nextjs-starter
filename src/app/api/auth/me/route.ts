import { NextResponse, type NextRequest } from 'next/server';
import { AUTH, HTTP_STATUS } from '@/lib/api/config';
import { mockUser, sessionUser } from '@/app/api/_mock/auth';

export async function GET(request: NextRequest) {
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
