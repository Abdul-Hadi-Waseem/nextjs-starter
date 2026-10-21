'use client';

import { useSyncExternalStore } from 'react';
import { Icons } from '@/components/icons';
import { openCommandPalette } from '@/components/kbar/lazy';
import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';

const MODIFIER_KEY = {
  MAC: '⌘',
  OTHER: 'Ctrl'
} as const;

const APPLE_PLATFORM = /Mac|iPhone|iPad|iPod/;

function subscribe() {
  return () => {};
}

function getModifierKey() {
  return APPLE_PLATFORM.test(navigator.userAgent) ? MODIFIER_KEY.MAC : MODIFIER_KEY.OTHER;
}

// The server doesn't know the platform: it renders an empty key, and the browser fills it in
// after hydration (no mismatch). The key has a fixed width so the swap doesn't shift anything.
function getServerModifierKey() {
  return '';
}

// Opens the Cmd+K palette. A field-like button from md up, an icon below.
export function HeaderSearch() {
  const modifierKey = useSyncExternalStore(subscribe, getModifierKey, getServerModifierKey);

  return (
    <Button
      variant='outline'
      onClick={openCommandPalette}
      aria-label='Search'
      aria-keyshortcuts='Meta+K Control+K'
      className='text-muted-foreground size-8 px-0 font-normal shadow-none md:w-56 md:justify-start md:gap-2 md:px-2.5 lg:w-64'
    >
      <Icons.search />
      <span className='hidden md:inline'>Search…</span>
      <KbdGroup className='ml-auto hidden md:inline-flex'>
        <Kbd className='w-8'>{modifierKey}</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </Button>
  );
}
