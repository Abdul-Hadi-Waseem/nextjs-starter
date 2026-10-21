import { Suspense } from 'react';
import { EXAMPLE_COLUMN } from '../../shared/constants/layout';
import { ServerAccountCard, ServerAccountCardSkeleton } from './server-account-card';

export function ServerComponentView() {
  return (
    <div className={EXAMPLE_COLUMN}>
      {/* Streaming: the shell renders now, the awaited call fills this slot when it resolves. */}
      <Suspense fallback={<ServerAccountCardSkeleton />}>
        <ServerAccountCard />
      </Suspense>
    </div>
  );
}

export function ServerComponentSkeleton() {
  return (
    <div className={EXAMPLE_COLUMN}>
      <ServerAccountCardSkeleton />
    </div>
  );
}
