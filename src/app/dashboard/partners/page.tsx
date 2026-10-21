import type { SearchParams } from 'nuqs/server';

import { PartnerListing } from '@/features/partners/components/partner-listing';
import { PartnersPageShell } from '@/features/partners/components/partners-page-shell';
import { partnersSearchParamsCache } from '@/features/partners/lib/search-params-cache';

export const metadata = {
  title: 'Partners'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  partnersSearchParamsCache.parse(await props.searchParams);

  return (
    <PartnersPageShell>
      <PartnerListing />
    </PartnersPageShell>
  );
}
