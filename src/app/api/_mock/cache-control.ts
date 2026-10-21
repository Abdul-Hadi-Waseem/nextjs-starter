// Cache-Control for the mock API. A real backend sets the same values.
import { NextResponse } from 'next/server';
import { CACHE_CONTROL } from '@/lib/api/config';

export const PUBLIC_HEADERS = { 'Cache-Control': CACHE_CONTROL.PUBLIC } as const;
export const PRIVATE_HEADERS = { 'Cache-Control': CACHE_CONTROL.PRIVATE } as const;

/** NextResponse.json for per-user answers: no CDN or browser cache may store them. */
export function privateJson(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set('Cache-Control', CACHE_CONTROL.PRIVATE);
  return NextResponse.json(body, { ...init, headers });
}
