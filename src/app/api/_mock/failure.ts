// "Fail the next request" switch on the optimistic page: the client adds ?fail=true.
import type { NextRequest } from 'next/server';
import { HTTP_STATUS } from '@/lib/api/config';
import { privateJson } from '@/app/api/_mock/cache-control';

export const FAIL_PARAM = 'fail';

export function failureRequested(request: NextRequest) {
  return request.nextUrl.searchParams.get(FAIL_PARAM) === 'true';
}

export function simulatedFailure() {
  return privateJson(
    { success: false, message: 'Simulated failure' },
    { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
  );
}
