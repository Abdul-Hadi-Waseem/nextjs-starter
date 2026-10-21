// How amounts are shown: a client-only preference shared by components that
// aren't parent and child (a toolbar toggle, every table and card with money).
// Same pattern as src/stores/ui-preferences.ts.
//
// Persisted with `skipHydration`, so the server and the first client render agree;
// <AmountDisplayHydrator /> loads the saved values after mount.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DISPLAY_CURRENCIES, type DisplayCurrency } from '../constants/amount-display';

type AmountDisplay = {
  currency: DisplayCurrency;
  hideAmounts: boolean;
  setCurrency: (currency: DisplayCurrency) => void;
  setHideAmounts: (hideAmounts: boolean) => void;
};

export const useAmountDisplay = create<AmountDisplay>()(
  persist(
    (set) => ({
      currency: DISPLAY_CURRENCIES[0],
      hideAmounts: false,
      setCurrency: (currency) => set({ currency }),
      setHideAmounts: (hideAmounts) => set({ hideAmounts })
    }),
    { name: 'examples-amount-display', skipHydration: true }
  )
);
