// BFF proxy: the browser calls this app, and this handler calls the backend with a
// server-only secret. The browser never sees BACKEND_API_KEY.
import { NextResponse, type NextRequest } from 'next/server';
import { mockApiDisabled } from '@/app/api/_mock/guard';
import { env } from '@/env';
import { AUTH, HTTP_STATUS } from '@/lib/api/config';
import { notAuthenticated } from '@/app/api/_mock/auth';
import { PRIVATE_HEADERS, privateJson } from '@/app/api/_mock/cache-control';

// Only these backend paths can be reached, so a caller can't point the proxy anywhere else (SSRF).
const PROXY_TARGETS = {
  account: '/examples/account'
} as const;

const BACKEND_TIMEOUT_MS = 5000;
// With redirect: 'manual', a 3xx comes back as-is (Node) or as an opaque redirect.
const REDIRECT_MIN = 300;
const REDIRECT_MAX = 400;
// Response headers passed back to the browser; everything else from the backend is dropped.
const FORWARDED_RESPONSE_HEADERS = ['content-type'] as const;

function isTarget(resource: string): resource is keyof typeof PROXY_TARGETS {
  return Object.hasOwn(PROXY_TARGETS, resource);
}

function backendUrl(path: string) {
  // Here the backend is NEXT_PUBLIC_API_URL (the mock API). A BFF can use a server-only URL instead.
  const base = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  return `${base}${path}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  // Example route; drop this guard in a real BFF.
  const disabled = mockApiDisabled();
  if (disabled) return disabled;

  const { resource } = await params;
  if (!isTarget(resource)) {
    return privateJson({ message: 'Not found' }, { status: HTTP_STATUS.NOT_FOUND });
  }

  const token = request.cookies.get(env.AUTH_COOKIE_NAME)?.value;
  // With auth off (open demo) the backend answers without a session, like the other mock routes.
  if (!token && AUTH.enabled) return notAuthenticated();

  // Build the outgoing headers from scratch: only the session cookie and the secret,
  // never the incoming Host, Cookie or other headers wholesale. A backend that expects
  // a bearer token gets `Authorization: Bearer ${token}` here instead of the cookie.
  const headers = new Headers({ Accept: 'application/json' });
  if (token) headers.set('Cookie', `${env.AUTH_COOKIE_NAME}=${token}`);
  if (env.BACKEND_API_KEY) headers.set('X-Api-Key', env.BACKEND_API_KEY);

  let upstream: Response;
  try {
    // Route handlers talk to the backend with fetch directly: `api` forwards every cookie.
    upstream = await fetch(backendUrl(PROXY_TARGETS[resource]), {
      headers,
      cache: 'no-store',
      // Never follow a redirect: fetch would resend X-Api-Key to wherever it points.
      redirect: 'manual',
      signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS)
    });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'TimeoutError';
    return privateJson(
      { message: timedOut ? 'Backend timed out' : 'Backend unreachable' },
      {
        status: timedOut ? HTTP_STATUS.GATEWAY_TIMEOUT : HTTP_STATUS.BAD_GATEWAY
      }
    );
  }

  const isRedirect =
    upstream.type === 'opaqueredirect' ||
    (upstream.status >= REDIRECT_MIN && upstream.status < REDIRECT_MAX);
  if (isRedirect) {
    return privateJson(
      { message: 'Unexpected redirect from the backend' },
      { status: HTTP_STATUS.BAD_GATEWAY }
    );
  }

  const responseHeaders = new Headers(PRIVATE_HEADERS);
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders
  });
}
