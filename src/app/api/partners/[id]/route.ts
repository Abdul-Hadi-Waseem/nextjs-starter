// ============================================================
// Route Handler — Single Partner (detail + recent payouts + stats)
// ============================================================
// See src/app/api/partners/route.ts for pattern documentation.
// ============================================================

import { fakePartners } from '@/app/api/_mock/db/partners';
import { fakePayouts } from '@/app/api/_mock/db/payouts';
import { HTTP_STATUS } from '@/lib/api/config';
import type { NextRequest } from 'next/server';
import { requireSession } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { privateJson } from '@/app/api/_mock/cache-control';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const data = await fakePartners.getPartnerById(id);

  if (!data.success) {
    return privateJson(data, { status: HTTP_STATUS.NOT_FOUND });
  }

  return privateJson({
    success: true,
    partner: data.partner,
    ...fakePayouts.getPartnerActivity(id)
  });
}
