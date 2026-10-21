import { HTTP_METHOD, request, type RequestOptions } from './http';

type Options = Omit<RequestOptions, 'method'>;

/**
 * The one way to call the backend. Authenticated by default (sends the
 * httpOnly auth cookie); pass `{ auth: false }` for public endpoints.
 *
 *   api.get<Plan[]>('/plans', { auth: false })
 *   api.get<PartnersResponse>('/partners', { query: filters })
 *   api.post<Payout>('/payouts', { body: payload })
 */
export const api = {
  get: <T>(path: string, options?: Options) =>
    request<T>(path, { ...options, method: HTTP_METHOD.GET }),
  post: <T>(path: string, options?: Options) =>
    request<T>(path, { ...options, method: HTTP_METHOD.POST }),
  put: <T>(path: string, options?: Options) =>
    request<T>(path, { ...options, method: HTTP_METHOD.PUT }),
  patch: <T>(path: string, options?: Options) =>
    request<T>(path, { ...options, method: HTTP_METHOD.PATCH }),
  delete: <T>(path: string, options?: Options) =>
    request<T>(path, { ...options, method: HTTP_METHOD.DELETE })
};

export { ApiError, isApiError } from './errors';
export { API_URL, AUTH, CACHE_CONTROL, HTTP_STATUS } from './config';
export { NEXT_PARAM, safeNextPath, signInUrl } from './redirect';
export type { RequestOptions } from './http';
