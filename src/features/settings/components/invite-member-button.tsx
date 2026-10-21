'use client';

import { useId } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { INVITE_DISABLED_HINT } from '../constants/settings';

/**
 * Inviting needs a real backend, so the button is disabled on purpose. It stays focusable
 * (`focusableWhenDisabled`) so keyboard and pointer users can still read why.
 */
export function InviteMemberButton() {
  const hintId = useId();

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              disabled
              focusableWhenDisabled
              aria-describedby={hintId}
              className='data-disabled:hover:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:active:translate-y-0'
            />
          }
        >
          <Icons.add aria-hidden='true' />
          Invite member
        </TooltipTrigger>
        <TooltipContent>{INVITE_DISABLED_HINT}</TooltipContent>
      </Tooltip>
      <span id={hintId} className='sr-only'>
        {INVITE_DISABLED_HINT}
      </span>
    </>
  );
}
