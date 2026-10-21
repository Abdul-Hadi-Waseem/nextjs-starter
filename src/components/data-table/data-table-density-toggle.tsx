'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { TABLE_DENSITY, useUiPreferences } from '@/stores/ui-preferences';

/** Switches every data table between comfortable and compact rows. */
export function DataTableDensityToggle() {
  const density = useUiPreferences((state) => state.tableDensity);
  const toggle = useUiPreferences((state) => state.toggleTableDensity);
  const compact = density === TABLE_DENSITY.COMPACT;

  return (
    <Button
      variant='outline'
      size='icon'
      className='hidden lg:inline-flex'
      onClick={toggle}
      aria-pressed={compact}
      aria-label={compact ? 'Use comfortable rows' : 'Use compact rows'}
      title={compact ? 'Comfortable rows' : 'Compact rows'}
    >
      {compact ? <Icons.rowsComfortable /> : <Icons.rowsCompact />}
    </Button>
  );
}
