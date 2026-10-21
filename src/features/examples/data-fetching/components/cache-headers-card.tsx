import { CACHE_CONTROL } from '@/lib/api';
import { ExampleCard } from '../../shared/components/example-card';

const COPY = {
  title: 'Response headers',
  description: 'What each mock route lets a CDN or the browser keep; check them in DevTools.',
  source: 'src/features/examples/data-fetching/components/cache-headers-card.tsx'
} as const;

const ROUTES = [
  { path: '/api/examples/exchange-rates', header: CACHE_CONTROL.PUBLIC, scope: 'Shared' },
  { path: '/api/examples/account', header: CACHE_CONTROL.PRIVATE, scope: 'Per user' }
] as const;

export function CacheHeadersCard() {
  return (
    <ExampleCard {...COPY}>
      <dl className='grid gap-4 text-sm'>
        {ROUTES.map(({ path, header, scope }) => (
          <div key={path} className='grid gap-1.5'>
            <dt className='flex items-baseline justify-between gap-3'>
              <span className='font-mono text-xs [overflow-wrap:anywhere]'>{path}</span>
              <span className='text-muted-foreground shrink-0 text-xs'>{scope}</span>
            </dt>
            <dd className='bg-muted text-muted-foreground rounded-md px-2 py-1.5 font-mono text-xs [overflow-wrap:anywhere]'>
              Cache-Control: <span className='text-foreground'>{header}</span>
            </dd>
          </div>
        ))}
      </dl>
    </ExampleCard>
  );
}
