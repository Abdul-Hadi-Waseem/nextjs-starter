import { EXAMPLE_GRID } from '../../shared/constants/layout';
import { Suspense } from 'react';
import { ActionSecurityCard } from './action-security-card';
import { DisplayNameCard, DisplayNameCardSkeleton } from './display-name-card';

export function ServerActionView() {
  return (
    <div className={EXAMPLE_GRID}>
      <Suspense fallback={<DisplayNameCardSkeleton />}>
        <DisplayNameCard />
      </Suspense>
      <ActionSecurityCard />
    </div>
  );
}

export function ServerActionSkeleton() {
  return (
    <div className={EXAMPLE_GRID}>
      <DisplayNameCardSkeleton />
      <ActionSecurityCard />
    </div>
  );
}
