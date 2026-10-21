'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/** Single-line text that ellipsizes; hovering shows the full text. Screen readers
 * get the full text anyway (truncation is visual only). */
export function TruncatedText({ text, className }: { text: string; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span />} className={`block max-w-md truncate ${className ?? ''}`}>
        {text}
      </TooltipTrigger>
      <TooltipContent className='max-w-sm'>{text}</TooltipContent>
    </Tooltip>
  );
}
