import { AUTH } from './config';

/** Query param that carries the page to return to after sign-in. */
export const NEXT_PARAM = 'next';

// Resolving against a placeholder origin catches every trick the URL parser
// normalises (`//evil.com`, `/\\evil.com`, a tab or newline after the slash).
const SAME_ORIGIN_BASE = 'http://same-origin.invalid';

// Only same-site relative paths: whatever `next` resolves to must stay on this origin.
export function isSafeNextPath(next: string | null | undefined): next is string {
  if (!next || !next.startsWith('/')) return false;
  try {
    return new URL(next, SAME_ORIGIN_BASE).origin === SAME_ORIGIN_BASE;
  } catch {
    return false;
  }
}

/** Where to go after sign-in: `next` when it is safe, else the home page. */
export function safeNextPath(next: string | null | undefined) {
  return isSafeNextPath(next) ? next : AUTH.homePath;
}

/** The sign-in URL, carrying `next` when it is safe. */
export function signInUrl(next?: string | null) {
  if (!isSafeNextPath(next)) return AUTH.signInPath;
  return `${AUTH.signInPath}?${new URLSearchParams({ [NEXT_PARAM]: next })}`;
}
