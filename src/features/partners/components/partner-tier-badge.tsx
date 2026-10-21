import { Badge } from '@/components/ui/badge';
import { PARTNER_TIER_LABEL, type PartnerTier } from '../constants/partner-options';

export function PartnerTierBadge({ tier }: { tier: PartnerTier }) {
  return <Badge variant='outline'>{PARTNER_TIER_LABEL[tier]}</Badge>;
}
