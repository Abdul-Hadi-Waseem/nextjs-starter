// The mock backend is for local development and demos only. In production it
// answers 404 unless ENABLE_MOCK_API=true is set on purpose; otherwise a
// deployment that forgot NEXT_PUBLIC_API_URL would expose a login that accepts
// any password.
import { env } from '@/env';
import { HTTP_STATUS } from '@/lib/api/config';
import { privateJson } from './cache-control';

export const MOCK_API_ENABLED = env.NODE_ENV !== 'production' || env.ENABLE_MOCK_API;

export function mockApiDisabled() {
  if (MOCK_API_ENABLED) return null;
  return privateJson(
    { success: false, message: 'Mock API is disabled in production' },
    { status: HTTP_STATUS.NOT_FOUND }
  );
}
