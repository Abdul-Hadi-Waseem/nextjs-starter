import type { NextRequest } from 'next/server';
import { currentUser, mockUser, notAuthenticated, setMockUserName } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { parseBody } from '@/app/api/_mock/validation';
import { profileSchema } from '@/features/settings/schemas/profile';
import { privateJson } from '@/app/api/_mock/cache-control';

export async function GET(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  // With auth disabled, currentUser falls back to the demo admin.
  const user = currentUser(request);
  if (!user) return notAuthenticated();
  return privateJson({ success: true, user });
}

// Settings → profile. Only `name` is editable; the mock keeps it in memory per email.
export async function PATCH(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const user = currentUser(request);
  if (!user) return notAuthenticated();

  const { data: body, error } = await parseBody(request, profileSchema);
  if (error) return error;

  setMockUserName(user.email, body.name);
  return privateJson({ success: true, user: mockUser(user.email) });
}
