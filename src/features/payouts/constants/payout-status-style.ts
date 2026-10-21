import type { Icons } from '@/components/icons';
import { PAYOUT_STATUS, type PayoutStatus } from './payout-options';

// Icon + label + token color, so a status never relies on color alone.
// Used by the status badge, the table filter, and the overview breakdown bar.
export const PAYOUT_STATUS_STYLE: Record<
  PayoutStatus,
  { icon: keyof typeof Icons; badgeClassName: string; barClassName: string }
> = {
  [PAYOUT_STATUS.PAID]: {
    icon: 'circleCheck',
    badgeClassName: 'bg-success/10 text-success dark:bg-success/20',
    barClassName: 'bg-success'
  },
  [PAYOUT_STATUS.PENDING]: {
    icon: 'clock',
    badgeClassName: 'bg-muted text-muted-foreground',
    barClassName: 'bg-muted-foreground/60'
  },
  [PAYOUT_STATUS.FAILED]: {
    icon: 'xCircle',
    badgeClassName: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
    barClassName: 'bg-destructive'
  }
};
