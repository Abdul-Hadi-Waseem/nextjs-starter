import { Skeleton } from '@/components/ui/skeleton';
import type { AccountSummary } from '../api/types';

const FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' }
] as const;

export function AccountDetails({ account }: { account: AccountSummary }) {
  return (
    <dl className='grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm'>
      {FIELDS.map(({ key, label }) => (
        <div key={key} className='contents'>
          <dt className='text-muted-foreground'>{label}</dt>
          <dd className={key === 'role' ? 'capitalize' : 'truncate'}>{account[key]}</dd>
        </div>
      ))}
    </dl>
  );
}

export function AccountDetailsSkeleton() {
  return (
    <div className='grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2'>
      {FIELDS.map(({ key }) => (
        <div key={key} className='contents'>
          <Skeleton className='h-lh w-12' />
          <Skeleton className='h-lh w-40' />
        </div>
      ))}
    </div>
  );
}
