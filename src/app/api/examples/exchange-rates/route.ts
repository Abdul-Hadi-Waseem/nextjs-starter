// Public example endpoint: no session needed, same answer for everyone.
import { NextResponse } from 'next/server';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { PUBLIC_HEADERS } from '@/app/api/_mock/cache-control';
import { exchangeRates } from '@/app/api/_mock/db/examples';

export async function GET() {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;

  // No requireSession: public data. Shared caches (CDN) may keep it, see CACHE_CONTROL.
  return NextResponse.json(exchangeRates(), {
    headers: PUBLIC_HEADERS
  });
}
