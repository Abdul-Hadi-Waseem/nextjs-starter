export const ROLE = {
  ADMIN: 'admin',
  MEMBER: 'member'
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

/** Prefill for the mock API's sign-in (any password works there). */
export const DEMO_ADMIN = { email: 'admin@example.com', password: 'demo' } as const;
