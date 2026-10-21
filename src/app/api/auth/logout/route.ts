import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/app/api/_mock/auth';
import { mockApiDisabled } from '@/app/api/_mock/guard';

export async function POST() {
  const disabled = mockApiDisabled();
  if (disabled) return disabled;
  return clearSessionCookie(NextResponse.json({ success: true }));
}
