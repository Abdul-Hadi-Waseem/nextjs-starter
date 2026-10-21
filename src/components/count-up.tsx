'use client';

import { useEffect, useRef } from 'react';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

export const STAT_FORMAT = {
  CURRENCY: 'currency',
  NUMBER: 'number'
} as const;

export type StatFormat = (typeof STAT_FORMAT)[keyof typeof STAT_FORMAT];

const COUNT_UP_DURATION_MS = 800;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export function formatStatValue(value: number, format: StatFormat) {
  return format === STAT_FORMAT.CURRENCY
    ? formatCurrency(value)
    : numberFormatter.format(Math.round(value));
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

interface CountUpProps {
  value: number;
  format?: StatFormat;
  className?: string;
}

// Counts up from 0 the first time the number renders in the browser.
// - The server HTML already holds the final value, so there's no flash of 0 before
//   hydration and nothing to measure for CLS.
// - The invisible copy of the final value reserves the width, so shorter intermediate
//   values never change the box size.
// - Frames write the text node directly (no React state per frame). A ~20-line rAF tween
//   instead of `motion`: `animate` from 'motion' is ~24 KB gzipped for a number tween.
// - Reduced motion: no animation, the final value is shown as rendered.
export function CountUp({ value, format = STAT_FORMAT.NUMBER, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const formatted = formatStatValue(value, format);

  useEffect(() => {
    const node = ref.current?.firstChild;
    if (!node) return;

    if (hasAnimated.current || window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      hasAnimated.current = true;
      node.nodeValue = formatted;
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / COUNT_UP_DURATION_MS, 1);
      node.nodeValue =
        progress < 1 ? formatStatValue(value * easeOutCubic(progress), format) : formatted;
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        hasAnimated.current = true;
      }
    };
    frame = requestAnimationFrame(tick);

    // Cancelled before finishing (unmount, Strict Mode re-run, new value): the next run
    // starts over or writes the final value.
    return () => cancelAnimationFrame(frame);
  }, [value, format, formatted]);

  return (
    <span className={cn('inline-grid tabular-nums', className)}>
      <span aria-hidden='true' className='invisible col-start-1 row-start-1'>
        {formatted}
      </span>
      <span ref={ref} className='col-start-1 row-start-1'>
        {formatted}
      </span>
    </span>
  );
}
