import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/env';
import { AUTH } from '@/lib/api/config';
import { NEXT_PARAM } from '@/lib/api/redirect';

const PROTECTED_PREFIX = '/dashboard';

// Only checks that the auth cookie exists and redirects to sign-in if not.
// The backend still verifies the token on every request.
export function proxy(req: NextRequest) {
  if (!AUTH.enabled) return NextResponse.next();

  const { pathname, search } = req.nextUrl;
  const hasSession = req.cookies.has(env.AUTH_COOKIE_NAME);

  if (pathname.startsWith(PROTECTED_PREFIX) && !hasSession) {
    const signIn = new URL(AUTH.signInPath, req.url);
    signIn.searchParams.set(NEXT_PARAM, pathname + search);
    return NextResponse.redirect(signIn);
  }

  if (pathname.startsWith(AUTH.signInPath) && hasSession) {
    return NextResponse.redirect(new URL(AUTH.homePath, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
