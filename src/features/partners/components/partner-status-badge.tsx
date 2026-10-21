import { Badge } from '@/components/ui/badge';
import {
  PARTNER_STATUS,
  PARTNER_STATUS_LABEL,
  type PartnerStatus
} from '../constants/partner-options';
import { PARTNER_STATUS_ICON } from '../constants/partner-status-icon';

const STATUS_CLASS = {
  [PARTNER_STATUS.ACTIVE]: 'bg-success/10 text-success dark:bg-success/20',
  [PARTNER_STATUS.PENDING]: 'bg-primary/10 text-primary dark:bg-primary/20',
  [PARTNER_STATUS.PAUSED]: 'bg-muted text-muted-foreground'
} as const satisfies Record<PartnerStatus, string>;

/** Status as icon + label on a tinted token background (never color alone). */
export function PartnerStatusBadge({ status }: { status: PartnerStatus }) {
  const Icon = PARTNER_STATUS_ICON[status];
  return (
    <Badge variant='secondary' className={STATUS_CLASS[status]}>
      <Icon aria-hidden='true' data-icon='inline-start' />
      {PARTNER_STATUS_LABEL[status]}
    </Badge>
  );
}
