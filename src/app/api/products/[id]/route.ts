// ============================================================
// Route Handler — Single Product (get + update)
// ============================================================
// See src/app/api/products/route.ts for pattern documentation.
// ============================================================

import { fakeProducts } from '@/app/api/_mock/db/products';
import type { NextRequest } from 'next/server';
import { requireSession } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { privateJson } from '@/app/api/_mock/cache-control';
import { HTTP_STATUS } from '@/lib/api/config';
import { parseBody } from '@/app/api/_mock/validation';
import { productPayloadSchema } from '@/features/examples/tables/products/schemas/product';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const data = await fakeProducts.getProductById(Number(id));

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

  const { data: body, error } = await parseBody(request, productPayloadSchema);
  if (error) return error;

  const { id } = await params;
  const data = await fakeProducts.updateProduct(Number(id), body);

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
  const data = await fakeProducts.deleteProduct(Number(id));

  if (!data.success) {
    return privateJson(data, { status: HTTP_STATUS.NOT_FOUND });
  }

  return privateJson(data);
}
