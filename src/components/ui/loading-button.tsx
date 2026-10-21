'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface LoadingButtonProps extends Omit<React.ComponentProps<typeof Button>, 'className'> {
  /** When true, overlays a spinner and disables the button. */
  loading?: boolean;
  /** Polite screen-reader announcement while loading. */
  loadingLabel?: string;
  /**
   * When true, overlays a check mark and keeps the button disabled. Turn it on
   * briefly after the action succeeds (e.g. before a sheet closes); the caller
   * owns the timing.
   */
  success?: boolean;
  /** Polite screen-reader announcement once `success` turns on. */
  successLabel?: string;
  className?: string;
}

/**
 * A `Button` with built-in loading and success states. The spinner (or check
 * mark) is overlaid on top of the label, which stays in layout (`opacity-0`)
 * meanwhile — so toggling `loading` / `success` never changes the button's
 * size and there's no layout shift. Inherits every Button `variant` / `size`
 * and the theme tokens.
 */
export function LoadingButton({
  loading = false,
  loadingLabel = 'Loading…',
  success = false,
  successLabel = 'Done',
  disabled,
  className,
  children,
  ...props
}: LoadingButtonProps) {
  const gap = props.size === 'sm' || props.size === 'xs' ? 'gap-1' : 'gap-1.5';
  // Success wins over loading, so a caller that flips both at once still shows the check.
  const showSpinner = loading && !success;
  const busy = loading || success;

  return (
    <>
      <Button
        {...props}
        disabled={disabled || busy}
        aria-busy={showSpinner || undefined}
        className={cn('relative', busy && 'disabled:opacity-100', className)}
      >
        {/* Spinner and hidden label wait 150ms (animate-show-delayed, delay-150), so a fast
            action never blinks; the button is disabled at once. */}
        {showSpinner && (
          <span className='animate-show-delayed absolute inset-0 grid place-items-center'>
            <Spinner aria-hidden />
          </span>
        )}
        {success && (
          <Icons.check
            aria-hidden
            data-slot='loading-button-success'
            className='absolute inset-0 m-auto size-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-50'
          />
        )}
        <span
          className={cn(
            'inline-flex items-center transition-opacity duration-0',
            gap,
            showSpinner && 'opacity-0 delay-150',
            success && 'opacity-0'
          )}
        >
          {children}
        </span>
      </Button>
      <span role='status' aria-live='polite' className='sr-only'>
        {success ? successLabel : showSpinner ? loadingLabel : ''}
      </span>
    </>
  );
}
