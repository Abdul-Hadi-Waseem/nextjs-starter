import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PartnerDetail } from '@/features/partners/components/partner-detail/partner-detail';
import { PartnerDetailShell } from '@/features/partners/components/partner-detail/partner-detail-shell';
import { getPartnerQueryClient } from '@/features/partners/lib/get-partner-query-client';

type PageProps = { params: Promise<{ id: string }> };

// Shares the page's fetch (getPartnerQueryClient is cached per request).
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { id } = await props.params;
  const { data } = await getPartnerQueryClient(id);
  return { title: data?.partner.name ?? 'Partner not found' };
}

export default async function Page(props: PageProps) {
  const { id } = await props.params;
  // Awaited (not `void`) so a missing partner renders not-found.tsx. loading.tsx streams
  // first, so the HTTP status stays 200 (Next adds a noindex meta); drop loading.tsx if a
  // real 404 status matters more than the instant skeleton.
  const { queryClient, notFound: isMissing } = await getPartnerQueryClient(id);
  if (isMissing) notFound();

  return (
    <PartnerDetailShell>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PartnerDetail id={id} />
      </HydrationBoundary>
    </PartnerDetailShell>
  );
}
