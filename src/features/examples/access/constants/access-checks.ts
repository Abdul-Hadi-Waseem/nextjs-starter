import { PERMISSION, ROLE } from '@/features/auth/constants/auth';
import type { PermissionCheck } from '@/types';

export const ADMIN_ACCESS = { role: ROLE.ADMIN } as const satisfies PermissionCheck;

/** The checks the access example runs against the signed-in user. */
export const ACCESS_CHECKS = [
  { label: 'Admin role', rule: '{ role: ROLE.ADMIN }', check: ADMIN_ACCESS },
  {
    label: 'Manage the team',
    rule: `{ permission: '${PERMISSION.TEAM_WRITE}' }`,
    check: { permission: PERMISSION.TEAM_WRITE }
  },
  {
    label: 'Create payouts',
    rule: `{ permission: '${PERMISSION.PAYOUTS_WRITE}' }`,
    check: { permission: PERMISSION.PAYOUTS_WRITE }
  }
] as const satisfies readonly { label: string; rule: string; check: PermissionCheck }[];
