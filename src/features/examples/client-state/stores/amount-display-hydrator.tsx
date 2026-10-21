'use client';

import { useEffect } from 'react';
import { useAmountDisplay } from './amount-display';

/** Loads the saved amount display settings from localStorage after the first render. */
export function AmountDisplayHydrator() {
  useEffect(() => {
    void useAmountDisplay.persist.rehydrate();
  }, []);
  return null;
}
