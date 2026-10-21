'use client';

import { useQueryStates } from 'nuqs';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { payoutSheetParsers } from '../lib/search-params';
import { preloadPayoutForm } from './payout-sheet';

/** Opens the new-payout sheet by setting `?new=1`; starts loading the form on hover/focus. */
export function NewPayoutButton() {
  const [, setSheetParams] = useQueryStates(payoutSheetParsers);

  return (
    <Button
      className='motion-safe:active:scale-[0.98]'
      onPointerEnter={preloadPayoutForm}
      onFocus={preloadPayoutForm}
      onClick={() => void setSheetParams({ new: true })}
    >
      <Icons.add aria-hidden /> New payout
    </Button>
  );
}
