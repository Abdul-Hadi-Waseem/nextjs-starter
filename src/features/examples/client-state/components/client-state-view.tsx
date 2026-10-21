import { ExampleCard } from '../../shared/components/example-card';
import { RulesList } from '../../shared/components/rules-list';
import { EXAMPLE_GRID } from '../../shared/constants/layout';
import { AmountDisplayHydrator } from '../stores/amount-display-hydrator';
import { AmountPreview } from './amount-preview';
import { CurrencyPicker } from './currency-picker';
import { HideAmountsSwitch } from './hide-amounts-switch';

const CONTROLS_COPY = {
  title: 'Controls',
  description: 'Two components write to one store, remembered in this browser.',
  source: 'src/features/examples/client-state/stores/amount-display.ts'
} as const;

const PREVIEW_COPY = {
  title: 'Preview',
  description: 'A third component reads both fields; none pass props to each other.',
  source: 'src/features/examples/client-state/components/amount-preview.tsx'
} as const;

const WHEN_NOT_COPY = {
  title: 'When not to use Zustand',
  description: 'Only for client-only state shared by components that are not parent and child.',
  source: 'src/features/examples/client-state/components/client-state-view.tsx'
} as const;

const USE_INSTEAD = [
  'Server data: TanStack Query',
  'URL state (filters, pages, tabs): nuqs',
  'Form state: TanStack Form',
  'Needed in the server HTML (like the sidebar): a cookie'
] as const;

export function ClientStateView() {
  return (
    <div className={EXAMPLE_GRID}>
      <AmountDisplayHydrator />
      <ExampleCard {...CONTROLS_COPY}>
        <div className='flex flex-wrap items-center gap-4'>
          <CurrencyPicker />
          <HideAmountsSwitch />
        </div>
      </ExampleCard>
      <ExampleCard {...PREVIEW_COPY}>
        <AmountPreview />
      </ExampleCard>
      <ExampleCard {...WHEN_NOT_COPY}>
        <RulesList rules={USE_INSTEAD} />
      </ExampleCard>
    </div>
  );
}
