'use client';

import { useEffect } from 'react';
import { useUiPreferences } from './ui-preferences';

/** Loads saved UI preferences from localStorage after the first render. */
export function PreferencesHydrator() {
  useEffect(() => {
    void useUiPreferences.persist.rehydrate();
  }, []);
  return null;
}
