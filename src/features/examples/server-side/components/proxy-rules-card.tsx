import { ExampleCard } from '../../shared/components/example-card';
import { RulesList } from '../../shared/components/rules-list';

const COPY = {
  title: 'What stays on the server',
  description: 'Use a route handler when the browser must not see a secret or the backend itself.',
  source: 'src/features/examples/server-side/components/proxy-rules-card.tsx'
} as const;

const RULES = [
  'BACKEND_API_KEY is server-only in src/env.ts, never NEXT_PUBLIC_.',
  'Outgoing headers are built from scratch, not copied from the browser.',
  'Backend paths come from an allowlist; redirects are not followed.',
  'A timeout turns a hung backend call into a 504.'
] as const;

export function ProxyRulesCard() {
  return (
    <ExampleCard {...COPY}>
      <RulesList rules={RULES} />
    </ExampleCard>
  );
}
