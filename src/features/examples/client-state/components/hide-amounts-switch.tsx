'use client';

import { useId } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAmountDisplay } from '../stores/amount-display';

export function HideAmountsSwitch() {
  const id = useId();
  // Selects only `hideAmounts`: picking a currency doesn't re-render this switch.
  const hideAmounts = useAmountDisplay((state) => state.hideAmounts);
  const setHideAmounts = useAmountDisplay((state) => state.setHideAmounts);

  return (
    <div className='flex items-center gap-2'>
      <Switch id={id} checked={hideAmounts} onCheckedChange={setHideAmounts} />
      <Label htmlFor={id}>Hide amounts</Label>
    </div>
  );
}
