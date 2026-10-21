// ============================================================
// Route Handler — Single Payout (get + update + delete)
// ============================================================
// See src/app/api/partners/route.ts for pattern documentation.
// ============================================================

import { fakePartners } from '@/app/api/_mock/db/partners';
import { fakePayouts } from '@/app/api/_mock/db/payouts';
import { parseBody } from '@/app/api/_mock/validation';
import { payoutUpdateSchema } from '@/features/payouts/schemas/payout';
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
  const data = await fakePayouts.getPayoutById(id);

  if (!data.success) {
    return privateJson(data, { status: HTTP_STATUS.NOT_FOUND });
  }

  return privateJson(data);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  const { data: body, error } = await parseBody(request, payoutUpdateSchema);
  if (error) return error;

  if (!fakePartners.findById(body.partnerId)) {
    const message = `Partner with ID ${body.partnerId} not found`;
    return privateJson(
      { success: false, message, errors: { partnerId: [message] } },
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }

  const { id } = await params;
  const data = await fakePayouts.updatePayout(id, body);

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

  const { id } = await params;
  const data = await fakePayouts.deletePayout(id);

  if (!data.success) {
    return privateJson(data, { status: HTTP_STATUS.NOT_FOUND });
  }

  return privateJson(data);
}
