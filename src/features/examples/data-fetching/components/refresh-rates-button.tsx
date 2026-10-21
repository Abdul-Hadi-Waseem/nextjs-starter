'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { LoadingButton } from '@/components/ui/loading-button';
import { refreshExchangeRates } from '../actions/refresh-exchange-rates';

export function RefreshRatesButton() {
  const [isPending, startTransition] = useTransition();

  function refresh() {
    startTransition(async () => {
      const { ok } = await refreshExchangeRates();
      if (ok) toast.success('Cached rates refreshed');
      else toast.error("Couldn't refresh the rates. Sign in again.");
    });
  }

  return (
    <LoadingButton
      size='sm'
      variant='outline'
      loading={isPending}
      loadingLabel='Refreshing cached rates'
      onClick={refresh}
      className='ms-auto'
    >
      <Icons.refresh aria-hidden />
      Refresh cache
    </LoadingButton>
  );
}
