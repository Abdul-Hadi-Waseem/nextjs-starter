// Client-only UI preferences shared across components, remembered per browser.
//
// When to use Zustand here: state that is client-only AND shared by components
// that aren't parent/child. Server data → TanStack Query, URL state → nuqs,
// form state → TanStack Form. A store used by one feature goes in
// src/features/<name>/stores/; shared stores go here.
//
// Persisted to localStorage with `skipHydration`, so the server and first client
// render agree (no hydration mismatch). <PreferencesHydrator /> loads the saved
// values after mount. A user who changed a preference sees it apply right after
// load; preferences that must render on the server belong in a cookie instead.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const TABLE_DENSITY = {
  COMFORTABLE: 'comfortable',
  COMPACT: 'compact'
} as const;

export type TableDensity = (typeof TABLE_DENSITY)[keyof typeof TABLE_DENSITY];

type UiPreferences = {
  tableDensity: TableDensity;
  setTableDensity: (density: TableDensity) => void;
  toggleTableDensity: () => void;
};

export const useUiPreferences = create<UiPreferences>()(
  persist(
    (set) => ({
      tableDensity: TABLE_DENSITY.COMFORTABLE,
      setTableDensity: (tableDensity) => set({ tableDensity }),
      toggleTableDensity: () =>
        set((state) => ({
          tableDensity:
            state.tableDensity === TABLE_DENSITY.COMPACT
              ? TABLE_DENSITY.COMFORTABLE
              : TABLE_DENSITY.COMPACT
        }))
    }),
    { name: 'ui-preferences', skipHydration: true }
  )
);
