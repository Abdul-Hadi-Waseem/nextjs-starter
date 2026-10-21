import { cn } from '@/lib/utils';

// `animate-skeleton` (src/styles/globals.css) keeps it invisible for the first 150ms,
// so fast loads never flash a placeholder.
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='skeleton'
      className={cn('animate-skeleton rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };
