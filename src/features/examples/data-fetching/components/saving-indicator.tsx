'use client';

import { useIsMutating } from '@tanstack/react-query';
import { checklistMutationKeys } from '../api/mutations';
import { Readout } from '../../shared/components/readout';

const CHECKLIST_WRITES = { mutationKey: checklistMutationKeys.all } as const;
const SAVED = 'saved';

// A global indicator: counts every pending checklist write, wherever it was started.
// `busy` keeps a write that lands within 150ms from flashing "saving".
export function SavingIndicator() {
  const pending = useIsMutating(CHECKLIST_WRITES);
  const saving = `saving ${Math.max(pending, 1)}`;

  return (
    <span aria-live='polite'>
      <Readout
        label='Writes'
        value={pending > 0 ? saving : SAVED}
        values={[SAVED, saving]}
        busy={pending > 0}
      />
    </span>
  );
}
