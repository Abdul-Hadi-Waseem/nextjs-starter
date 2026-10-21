'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DISPLAY_CURRENCIES, type DisplayCurrency } from '../constants/amount-display';
import { useAmountDisplay } from '../stores/amount-display';

function isDisplayCurrency(value: unknown): value is DisplayCurrency {
  return DISPLAY_CURRENCIES.includes(value as DisplayCurrency);
}

export function CurrencyPicker() {
  // One field and one action, each with its own selector: this re-renders only when
  // `currency` changes. `const { currency } = useAmountDisplay()` would re-render on every change.
  const currency = useAmountDisplay((state) => state.currency);
  const setCurrency = useAmountDisplay((state) => state.setCurrency);

  return (
    <ToggleGroup
      aria-label='Currency'
      variant='outline'
      value={[currency]}
      onValueChange={(values) => {
        const [next] = values;
        if (isDisplayCurrency(next)) setCurrency(next);
      }}
    >
      {DISPLAY_CURRENCIES.map((code) => (
        <ToggleGroupItem key={code} value={code}>
          {code}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
