import { Icons } from '@/components/icons';
import { payoutStatusOptions } from '../../constants/payout-options';
import { PAYOUT_STATUS_STYLE } from '../../constants/payout-status-style';

// Status filter options, with the same icons as the status badges.
export const STATUS_FILTER_OPTIONS = payoutStatusOptions.map((option) => ({
  ...option,
  icon: Icons[PAYOUT_STATUS_STYLE[option.value].icon]
}));
