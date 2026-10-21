import { Icons } from '@/components/icons';
import { PARTNER_STATUS, type PartnerStatus } from './partner-options';

/** One icon per status, shared by the badge and the status filter. */
export const PARTNER_STATUS_ICON = {
  [PARTNER_STATUS.ACTIVE]: Icons.circleCheck,
  [PARTNER_STATUS.PENDING]: Icons.clock,
  [PARTNER_STATUS.PAUSED]: Icons.alertCircle
} as const satisfies Record<PartnerStatus, unknown>;
