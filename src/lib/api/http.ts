import { API_URL, HTTP_STATUS } from './config';
import { ApiError } from './errors';

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
} as const;

export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

type QueryValue = string | number | boolean | null | undefined;

export type RequestOptions = {
  method?: HttpMethod;
  query?: Record<string, QueryValue>;
  body?: unknown;
  /** Send the auth cookie. `false` for public endpoints. Defaults to `true`. */
  auth?: boolean;
  headers?: HeadersInit;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

const isServer = typeof window === 'undefined';

function buildUrl(path: string, query?: RequestOptions['query']) {
  const base = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
  const url = new URL(path.replace(/^\//, ''), base);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

// Server components, route handlers and server actions don't send the browser's
// cookies on their own, so forward them to the backend. Imported dynamically so
// next/headers never reaches the client bundle.
async function getServerCookieHeader() {
  try {
    const { cookies } = await import('next/headers');
    const store = await cookies();
    const header = store
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join('; ');
    return header || undefined;
  } catch {
    // Outside a request (e.g. build time) there are no cookies to forward.
    return undefined;
  }
}

async function parseBody(res: Response) {
  if (res.status === HTTP_STATUS.NO_CONTENT) return undefined;
  const contentType = res.headers.get('content-type') ?? '';
  return contentType.includes('application/json') ? res.json() : res.text();
}

function errorMessage(body: unknown, res: Response) {
  if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string') {
    return body.message;
  }
  return `Request failed: ${res.status} ${res.statusText}`;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = HTTP_METHOD.GET, query, body, auth = true, headers, ...init } = options;

  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');
  if (body !== undefined) requestHeaders.set('Content-Type', 'application/json');

  if (auth && isServer) {
    const cookie = await getServerCookieHeader();
    if (cookie) requestHeaders.set('Cookie', cookie);
  }

  const res = await fetch(buildUrl(path, query), {
    ...init,
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: auth ? 'include' : 'omit'
  });

  const data = await parseBody(res);

  if (!res.ok) {
    throw new ApiError(res.status, errorMessage(data, res), data);
  }

  return data as T;
}
