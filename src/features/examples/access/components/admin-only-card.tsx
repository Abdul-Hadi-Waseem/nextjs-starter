import Link from 'next/link';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ExampleCard } from '../../shared/components/example-card';
import { EXAMPLE_COLUMN } from '../../shared/constants/layout';
import { EXAMPLE_ROUTES } from '../../shared/constants/example-pages';

const COPY = {
  title: 'You are an admin',
  description: 'This page awaited requireAccess({ role: ROLE.ADMIN }); members get a 404.',
  source: 'src/features/examples/access/components/admin-only-card.tsx'
} as const;

export function AdminOnlyCard() {
  return (
    <div className={EXAMPLE_COLUMN}>
      <ExampleCard {...COPY}>
        <Link
          href={EXAMPLE_ROUTES.ACCESS}
          className={cn(buttonVariants({ variant: 'outline' }), 'w-fit')}
        >
          <Icons.chevronLeft aria-hidden />
          Back to access control
        </Link>
      </ExampleCard>
    </div>
  );
}

// Same shape as the card but no copy: it must not flash for members while requireAccess runs.
export function AdminOnlyCardSkeleton() {
  return (
    <div className={EXAMPLE_COLUMN}>
      <Card>
        <CardHeader className='gap-2'>
          <Skeleton className='h-lh w-40' />
          <Skeleton className='h-lh w-full' />
          <Skeleton className='h-lh w-3/4' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-8 w-48' />
        </CardContent>
        <CardFooter className='py-2.5'>
          <Skeleton className='h-4 w-64' />
        </CardFooter>
      </Card>
    </div>
  );
}
