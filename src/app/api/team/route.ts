// ============================================================
// Route Handler — Team members (admin only)
// ============================================================
// See src/app/api/partners/route.ts for pattern documentation.
// ============================================================

import { fakeTeam } from '@/app/api/_mock/db/team';
import type { NextRequest } from 'next/server';
import { ADMIN_ONLY_MESSAGE, requireAdmin, requireSession } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { privateJson } from '@/app/api/_mock/cache-control';

export async function GET(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  const forbidden = requireAdmin(request, ADMIN_ONLY_MESSAGE.TEAM);
  if (forbidden) return forbidden;

  return privateJson(await fakeTeam.getMembers());
}
