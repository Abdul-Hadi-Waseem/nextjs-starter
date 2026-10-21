// ============================================================
// Route Handler — Partners (list)
// ============================================================
// Used with Pattern 2 (Route Handlers + ORM) or Pattern 3 (BFF).
//
// Fullstack (ORM): Replace fakePartners calls with your ORM
//   const partners = await db.query.partners.findMany({ ... })
//
// BFF (proxy): Replace with fetch to your external backend
//   const res = await fetch(`${BACKEND_URL}/partners?${searchParams}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   })
//   return privateJson(await res.json())
//
// Current: Mock (in-memory fake data for demo/prototyping)
// ============================================================

import { fakePartners } from '@/app/api/_mock/db/partners';
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
  const tier = searchParams.get('tier') ?? undefined;
  const sort = searchParams.get('sort') ?? undefined;

  const data = await fakePartners.getPartners({ page, limit, search, status, tier, sort });

  return privateJson(data);
}
