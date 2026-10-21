import { useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * A static, blurred beam of the theme's primary color falling from the top-left corner.
 * Pure SVG, no JS and no animation: absolutely positioned, so it never affects layout or LCP.
 * Opacity stays low because `--primary` is near-black in some light themes and near-white in
 * dark ones; at these values it reads as a soft tint in both.
 */
export function Spotlight({ className }: { className?: string }) {
  const filterId = useId();

  return (
    <svg
      aria-hidden='true'
      focusable='false'
      viewBox='0 0 800 800'
      preserveAspectRatio='xMinYMin slice'
      className={cn(
        'pointer-events-none absolute inset-0 size-full opacity-[0.07] dark:opacity-[0.14]',
        className
      )}
    >
      <defs>
        <filter id={filterId} x='-50%' y='-50%' width='200%' height='200%'>
          <feGaussianBlur stdDeviation='70' />
        </filter>
      </defs>
      <ellipse
        cx='260'
        cy='180'
        rx='420'
        ry='130'
        transform='rotate(38 260 180)'
        fill='var(--primary)'
        filter={`url(#${filterId})`}
      />
      <ellipse
        cx='230'
        cy='150'
        rx='240'
        ry='60'
        transform='rotate(38 230 150)'
        fill='var(--primary)'
        fillOpacity='0.6'
        filter={`url(#${filterId})`}
      />
    </svg>
  );
}
