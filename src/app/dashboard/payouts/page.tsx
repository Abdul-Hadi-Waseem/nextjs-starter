import type { SearchParams } from 'nuqs/server';
import { PayoutListing } from '@/features/payouts/components/payout-listing';
import { PayoutsPageShell } from '@/features/payouts/components/payouts-page-shell';
import { payoutsSearchParamsCache } from '@/features/payouts/lib/search-params-cache';

export const metadata = {
  title: 'Payouts'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  payoutsSearchParamsCache.parse(await props.searchParams);

  return (
    <PayoutsPageShell>
      <PayoutListing />
    </PayoutsPageShell>
  );
}
