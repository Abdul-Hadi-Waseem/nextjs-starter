import { cn } from '@/lib/utils';

const TONE = {
  default: 'text-foreground',
  positive: 'text-success',
  negative: 'text-destructive'
} as const;

interface ReadoutProps {
  label: string;
  value: string;
  /**
   * Every value this readout can show. They share one grid cell and only the
   * current one is visible, so the chip is as wide as the widest and never resizes.
   */
  values?: readonly string[];
  /**
   * The value is a busy state (fetching, saving): it appears only once it has
   * lasted 150ms (the same delay as skeletons), so a quick request never flashes. Pure CSS (a delayed
   * visibility transition); leaving the busy state is immediate.
   */
  busy?: boolean;
  tone?: keyof typeof TONE;
}

/** Label + value chip for a piece of live state (fresh/stale, isFetching, fetched at, status). */
export function Readout({
  label,
  value,
  values = [value],
  busy = false,
  tone = 'default'
}: ReadoutProps) {
  return (
    <span className='inline-flex items-center gap-1.5 text-xs'>
      <span className='text-muted-foreground'>{label}</span>
      <span
        className={cn(
          'bg-muted inline-grid h-5 items-center rounded-sm px-1.5 font-mono tabular-nums',
          TONE[tone]
        )}
      >
        {values.map((option) => (
          <span
            key={option}
            aria-hidden={option !== value || undefined}
            className={cn(
              '[grid-area:1/1] transition-[visibility] duration-0',
              option === value ? 'visible' : 'invisible',
              busy && 'delay-150'
            )}
          >
            {option}
          </span>
        ))}
      </span>
    </span>
  );
}
