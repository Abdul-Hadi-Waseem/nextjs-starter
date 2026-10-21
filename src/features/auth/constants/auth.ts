export const ROLE = {
  ADMIN: 'admin',
  MEMBER: 'member'
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

/** Prefill for the mock API's sign-in (any password works there). */
export const DEMO_ADMIN = { email: 'admin@example.com', password: 'demo' } as const;

/** Permission strings the backend puts on the user (`user.permissions`). */
export const PERMISSION = {
  TEAM_READ: 'team:read',
  TEAM_WRITE: 'team:write',
  PAYOUTS_WRITE: 'payouts:write'
} as const;

export type Permission = (typeof PERMISSION)[keyof typeof PERMISSION];
