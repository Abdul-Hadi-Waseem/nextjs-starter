import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/app/api/_mock/auth';

export async function POST() {
  return clearSessionCookie(NextResponse.json({ success: true }));
}
