import { PartnerDetailShell } from '@/features/partners/components/partner-detail/partner-detail-shell';
import { PartnerDetailSkeleton } from '@/features/partners/components/partner-detail/partner-detail-skeleton';

export default function Loading() {
  return (
    <PartnerDetailShell>
      <PartnerDetailSkeleton />
    </PartnerDetailShell>
  );
}
