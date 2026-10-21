import { EXAMPLE_GRID } from '../../shared/constants/layout';
import { ProxyAccountCard, ProxyAccountCardSkeleton } from './proxy-account-card';
import { ProxyRulesCard } from './proxy-rules-card';

export function RouteHandlerView() {
  return (
    <div className={EXAMPLE_GRID}>
      <ProxyAccountCard />
      <ProxyRulesCard />
    </div>
  );
}

export function RouteHandlerSkeleton() {
  return (
    <div className={EXAMPLE_GRID}>
      <ProxyAccountCardSkeleton />
      <ProxyRulesCard />
    </div>
  );
}
