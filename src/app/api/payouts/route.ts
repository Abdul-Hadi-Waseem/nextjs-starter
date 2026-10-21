// ============================================================
// Route Handler — Payouts (list + create)
// ============================================================
// See src/app/api/partners/route.ts for pattern documentation.
// Current: Mock (in-memory fake data for demo/prototyping)
// ============================================================

import { fakePayouts } from '@/app/api/_mock/db/payouts';
import { parseBody } from '@/app/api/_mock/validation';
import { payoutSchema } from '@/features/payouts/schemas/payout';
import { HTTP_STATUS } from '@/lib/api/config';
import type { NextRequest } from 'next/server';
import { requireSession } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { privateJson } from '@/app/api/_mock/cache-control';

export async function GET(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  const { searchParams } = request.nextUrl;

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);
  const search = searchParams.get('search') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const partnerId = searchParams.get('partnerId') ?? undefined;
  const sort = searchParams.get('sort') ?? undefined;

  const data = await fakePayouts.getPayouts({ page, limit, search, status, partnerId, sort });

  return privateJson(data);
}

export async function POST(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  const { data: body, error } = await parseBody(request, payoutSchema);
  if (error) return error;

  const data = await fakePayouts.createPayout(body);

  if (!data.success) {
    return privateJson(
      { ...data, errors: { partnerId: [data.message] } },
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }

  return privateJson(data, { status: HTTP_STATUS.CREATED });
}
