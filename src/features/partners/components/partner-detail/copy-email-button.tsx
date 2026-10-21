'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { COPY_FEEDBACK_MS } from '../../constants/partner-table';

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      toast.error("Couldn't copy the email. Select it and copy it instead.");
      return;
    }
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
  }

  const Icon = copied ? Icons.check : Icons.copy;

  return (
    <>
      <Button
        variant='ghost'
        size='icon-xs'
        onClick={copy}
        aria-label={copied ? 'Email copied' : 'Copy email'}
        className='motion-safe:active:scale-[0.98]'
      >
        {/* key remounts the icon so the swap plays its zoom once, only after a click */}
        <Icon
          key={copied ? 'check' : 'copy'}
          aria-hidden='true'
          className={
            copied ? 'text-success motion-safe:animate-in motion-safe:zoom-in-50' : undefined
          }
        />
      </Button>
      <span role='status' aria-live='polite' className='sr-only'>
        {copied ? 'Email copied' : ''}
      </span>
    </>
  );
}
