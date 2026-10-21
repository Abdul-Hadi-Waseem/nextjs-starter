'use client';

import { Suspense, useId, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AddTaskCard } from './add-task-card';
import { ChecklistCard, ChecklistCardSkeleton } from './checklist-card';
import { SavingIndicator } from './saving-indicator';
import { EXAMPLE_GRID } from '../../shared/constants/layout';

export function OptimisticDemo() {
  const switchId = useId();
  const [failNext, setFailNext] = useState(false);

  // The next request fails once, then the switch turns itself off.
  function takeFailFlag() {
    if (failNext) setFailNext(false);
    return failNext;
  }

  return (
    <div className='grid gap-4'>
      <div className='flex min-h-8 flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <Switch id={switchId} checked={failNext} onCheckedChange={setFailNext} />
          <Label htmlFor={switchId}>Fail the next request</Label>
        </div>
        <SavingIndicator />
      </div>
      <div className={EXAMPLE_GRID}>
        <Suspense fallback={<ChecklistCardSkeleton />}>
          <ChecklistCard takeFailFlag={takeFailFlag} />
        </Suspense>
        <AddTaskCard takeFailFlag={takeFailFlag} />
      </div>
    </div>
  );
}
