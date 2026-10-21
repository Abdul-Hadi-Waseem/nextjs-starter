import type { FilterOption } from '@/lib/data-table/types';
import { partnerStatusOptions, partnerTierOptions } from '../../constants/partner-options';
import { PARTNER_STATUS_ICON } from '../../constants/partner-status-icon';

export const STATUS_FILTER_OPTIONS: FilterOption[] = partnerStatusOptions.map((option) => ({
  ...option,
  icon: PARTNER_STATUS_ICON[option.value]
}));

export const TIER_FILTER_OPTIONS: FilterOption[] = partnerTierOptions;
