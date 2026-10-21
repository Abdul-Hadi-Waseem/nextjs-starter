// ============================================================
// Route Handler — Single User (update + delete)
// ============================================================
// See src/app/api/users/route.ts for pattern documentation.
// ============================================================

import { fakeUsers } from '@/app/api/_mock/db/users';
import type { NextRequest } from 'next/server';
import { ADMIN_ONLY_MESSAGE, requireAdmin, requireSession } from '@/app/api/_mock/auth';
import { parseBody } from '@/app/api/_mock/validation';
import { userSchema } from '@/features/examples/tables/users/schemas/user';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { privateJson } from '@/app/api/_mock/cache-control';
import { HTTP_STATUS } from '@/lib/api/config';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;
  const forbidden = requireAdmin(request, ADMIN_ONLY_MESSAGE.USERS);
  if (forbidden) return forbidden;

  const { data: body, error } = await parseBody(request, userSchema);
  if (error) return error;

  const { id } = await params;
  const data = await fakeUsers.updateUser(Number(id), body);

  if (!data.success) {
    return privateJson(data, { status: HTTP_STATUS.NOT_FOUND });
  }

  return privateJson(data);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;
  const forbidden = requireAdmin(request, ADMIN_ONLY_MESSAGE.USERS);
  if (forbidden) return forbidden;

  const { id } = await params;
  const data = await fakeUsers.deleteUser(Number(id));

  if (!data.success) {
    return privateJson(data, { status: HTTP_STATUS.NOT_FOUND });
  }

  return privateJson(data);
}
