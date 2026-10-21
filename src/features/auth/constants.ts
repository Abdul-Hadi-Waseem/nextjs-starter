export const ROLE = {
  ADMIN: 'admin',
  MEMBER: 'member'
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
