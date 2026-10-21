'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { CountUp, STAT_FORMAT, type StatFormat } from '@/components/count-up';
import { Icons } from '@/components/icons';
import { Card, CardAction, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export type IconName = keyof typeof Icons;

const DEFAULT_DELTA_LABEL = 'vs previous period';
const deltaFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  signDisplay: 'exceptZero'
});

// A primary-colored spot at the pointer, masked to a 1px ring (the padding box minus
// the content box), so only the card's edge lights up. Mask colors are tokens because
// only their alpha matters.
const GLOW_STYLE: CSSProperties = {
  background:
    'radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), color-mix(in oklch, var(--primary) 55%, transparent), transparent 70%)',
  mask: 'linear-gradient(var(--foreground), var(--foreground)) content-box exclude, linear-gradient(var(--foreground), var(--foreground))'
};

function TrendIcon({ delta }: { delta: number }) {
  if (delta > 0) return <Icons.trendingUp className='size-4' aria-hidden='true' />;
  if (delta < 0) return <Icons.trendingDown className='size-4' aria-hidden='true' />;
  return <Icons.minus className='size-4' aria-hidden='true' />;
}

// Pointer-follow border glow: sets --x/--y on the card itself (no React state),
// at most once per frame. The listener lives on the card only.
function usePointerGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const update = () => {
      frame = 0;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${x - rect.left}px`);
      card.style.setProperty('--y', `${y - rect.top}px`);
    };
    const onPointerMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };

    card.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      card.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}

interface StatCardProps {
  label: string;
  value: number;
  format?: StatFormat;
  /** Change vs the previous period, in percent (8.2 = +8.2%) */
  delta?: number;
  /** Text after the delta, e.g. "vs last month" */
  deltaLabel?: string;
  /** Shown when there's no delta to compare with */
  noDeltaText?: string;
  hint?: string;
  icon?: IconName;
}

export function StatCard({
  label,
  value,
  format = STAT_FORMAT.NUMBER,
  delta,
  deltaLabel = DEFAULT_DELTA_LABEL,
  noDeltaText = 'No earlier data to compare',
  hint,
  icon
}: StatCardProps) {
  const ref = usePointerGlow();
  const Icon = icon ? Icons[icon] : null;

  return (
    <Card ref={ref} className='group/stat relative'>
      <div
        aria-hidden='true'
        style={GLOW_STYLE}
        className='pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 transition-opacity duration-300 group-focus-within/stat:opacity-100 group-hover/stat:opacity-100 motion-reduce:hidden'
      />
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        {Icon && (
          <CardAction>
            <Icon className='text-muted-foreground size-4' aria-hidden='true' />
          </CardAction>
        )}
        <CountUp value={value} format={format} className='text-2xl font-semibold' />
      </CardHeader>
      <CardContent className='flex flex-col items-start gap-1 text-sm'>
        {delta !== undefined ? (
          <p className='flex items-center gap-1.5 font-medium'>
            <TrendIcon delta={delta} />
            <span>
              <span className='tabular-nums'>{deltaFormatter.format(delta)}%</span> {deltaLabel}
            </span>
          </p>
        ) : (
          <p className='text-muted-foreground'>{noDeltaText}</p>
        )}
        {hint && <p className='text-muted-foreground'>{hint}</p>}
      </CardContent>
    </Card>
  );
}

interface StatCardSkeletonProps {
  label: string;
  icon?: IconName;
  hasHint?: boolean;
}

// Same header and line boxes as StatCard; only the value and the delta lines are
// placeholders (`h-lh` = one line of the surrounding text size).
export function StatCardSkeleton({ label, icon, hasHint = false }: StatCardSkeletonProps) {
  const Icon = icon ? Icons[icon] : null;

  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        {Icon && (
          <CardAction>
            <Icon className='text-muted-foreground size-4' aria-hidden='true' />
          </CardAction>
        )}
        <div className='text-2xl font-semibold'>
          <Skeleton className='h-lh w-32' />
        </div>
      </CardHeader>
      <CardContent className='flex flex-col items-start gap-1 text-sm'>
        <Skeleton className='h-lh w-40' />
        {hasHint && <Skeleton className='h-lh w-20' />}
      </CardContent>
    </Card>
  );
}
