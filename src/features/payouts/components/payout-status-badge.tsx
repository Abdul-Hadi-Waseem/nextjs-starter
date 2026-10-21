import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { PAYOUT_STATUS_LABEL, type PayoutStatus } from '../constants/payout-options';
import { PAYOUT_STATUS_STYLE } from '../constants/payout-status-style';

// Shared with overview and partners: a domain component, so it stays in its feature.
export function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  const style = PAYOUT_STATUS_STYLE[status];
  const StatusIcon = Icons[style.icon];

  return (
    <Badge variant='secondary' className={style.badgeClassName}>
      <StatusIcon aria-hidden data-icon='inline-start' />
      {PAYOUT_STATUS_LABEL[status]}
    </Badge>
  );
}
