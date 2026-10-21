'use client';

import { formatCurrency } from '@/lib/format';
import { MASKED_AMOUNT, SAMPLE_AMOUNT } from '../constants/amount-display';
import { useAmountDisplay } from '../stores/amount-display';

export function AmountPreview() {
  // Two primitive selectors instead of one returning a new object each time.
  const currency = useAmountDisplay((state) => state.currency);
  const hideAmounts = useAmountDisplay((state) => state.hideAmounts);

  return (
    <p className='text-3xl font-semibold tabular-nums' aria-live='polite'>
      {hideAmounts ? (
        <>
          <span aria-hidden>{MASKED_AMOUNT}</span>
          <span className='sr-only'>Amount hidden</span>
        </>
      ) : (
        formatCurrency(SAMPLE_AMOUNT, currency)
      )}
    </p>
  );
}
