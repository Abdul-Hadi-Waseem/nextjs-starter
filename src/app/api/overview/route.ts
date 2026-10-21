// ============================================================
// Route Handler — Overview (KPIs, trend, status breakdown, recent payouts)
// ============================================================
// See src/app/api/partners/route.ts for pattern documentation.
// ============================================================

import { getOverview } from '@/app/api/_mock/db/overview';
import type { NextRequest } from 'next/server';
import { requireSession } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { privateJson } from '@/app/api/_mock/cache-control';

export async function GET(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  return privateJson(await getOverview());
}
