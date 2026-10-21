import { cn } from '@/lib/utils';

/** A divided list of PartnerSummary / PayoutSummary rows with a fixed row height (no layout shift). */
export function SummaryList({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('divide-y text-sm [&>li]:flex [&>li]:min-h-14 [&>li]:items-center', className)}
      {...props}
    />
  );
}
