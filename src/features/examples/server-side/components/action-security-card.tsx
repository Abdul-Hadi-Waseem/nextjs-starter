import { ExampleCard } from '../../shared/components/example-card';
import { RulesList } from '../../shared/components/rules-list';

const COPY = {
  title: 'Why the action checks the session',
  description: 'A server action is a public POST endpoint, callable without the form.',
  source: 'src/features/examples/server-side/components/action-security-card.tsx'
} as const;

const RULES = [
  'Check the session inside the action, not only on the page.',
  'Validate FormData with zod: it is untrusted input.',
  'Next.js rejects a mismatched Origin; a missing one gets through.',
  'Behind a proxy on another domain, set serverActions.allowedOrigins.'
] as const;

export function ActionSecurityCard() {
  return (
    <ExampleCard {...COPY}>
      <RulesList rules={RULES} />
    </ExampleCard>
  );
}
