// ============================================================
// Route Handler — Products (list + create)
// ============================================================
// Used with Pattern 2 (Route Handlers + ORM) or Pattern 3 (BFF).
//
// Fullstack (ORM): Replace fakeProducts calls with your ORM
//   const products = await db.query.products.findMany({ ... })
//
// BFF (proxy): Replace with fetch to your external backend
//   const res = await fetch(`${BACKEND_URL}/products?${searchParams}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   })
//   return privateJson(await res.json())
//
// Current: Mock (in-memory fake data for demo/prototyping)
// ============================================================

import { fakeProducts } from '@/app/api/_mock/db/products';
import type { NextRequest } from 'next/server';
import { requireSession } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { privateJson } from '@/app/api/_mock/cache-control';
import { HTTP_STATUS } from '@/lib/api/config';
import { parseBody } from '@/app/api/_mock/validation';
import { productPayloadSchema } from '@/features/examples/tables/products/schemas/product';

export async function GET(request: NextRequest) {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  const { searchParams } = request.nextUrl;

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);
  const categories = searchParams.get('categories') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const sort = searchParams.get('sort') ?? undefined;

  const data = await fakeProducts.getProducts({
    page,
    limit,
    categories,
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

  const { data: body, error } = await parseBody(request, productPayloadSchema);
  if (error) return error;

  const data = await fakeProducts.createProduct(body);
  return privateJson(data, { status: HTTP_STATUS.CREATED });
}
