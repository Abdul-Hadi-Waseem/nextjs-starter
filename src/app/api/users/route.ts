// ============================================================
// Route Handler — Users (list + create)
// ============================================================
// Used with Pattern 2 (Route Handlers + ORM) or Pattern 3 (BFF).
//
// Fullstack (ORM): Replace fakeUsers calls with your ORM
//   const users = await db.query.users.findMany({ ... })
//
// BFF (proxy): Replace with fetch to your external backend
//   const res = await fetch(`${BACKEND_URL}/users?${searchParams}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   })
//   return privateJson(await res.json())
//
// Current: Mock (in-memory fake data for demo/prototyping)
// ============================================================

import { fakeUsers } from '@/app/api/_mock/db/users';
import type { NextRequest } from 'next/server';
import { ADMIN_ONLY_MESSAGE, requireAdmin, requireSession } from '@/app/api/_mock/auth';
import { parseBody } from '@/app/api/_mock/validation';
import { userSchema } from '@/features/examples/tables/users/schemas/user';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { privateJson } from '@/app/api/_mock/cache-control';
import { HTTP_STATUS } from '@/lib/api/config';

export async function GET(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;
  const forbidden = requireAdmin(request, ADMIN_ONLY_MESSAGE.USERS);
  if (forbidden) return forbidden;

  const { searchParams } = request.nextUrl;

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);
  const roles = searchParams.get('roles') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const sort = searchParams.get('sort') ?? undefined;

  const data = await fakeUsers.getUsers({
    page,
    limit,
    roles,
    search,
    sort
  });

  return privateJson(data);
}

export async function POST(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;
  const forbidden = requireAdmin(request, ADMIN_ONLY_MESSAGE.USERS);
  if (forbidden) return forbidden;

  const { data: body, error } = await parseBody(request, userSchema);
  if (error) return error;

  const data = await fakeUsers.createUser(body);
  return privateJson(data, { status: HTTP_STATUS.CREATED });
}
