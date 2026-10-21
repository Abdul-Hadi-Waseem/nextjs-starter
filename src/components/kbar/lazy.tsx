'use client';

import dynamic from 'next/dynamic';
import { COMMAND_PALETTE_TOGGLE_EVENT } from './constants';

// kbar (~38 KB gzipped) loads in its own chunk after the page is interactive.
const KBar = dynamic(() => import('./index'), { ssr: false });

export function CommandPalette() {
  return <KBar />;
}

export function openCommandPalette() {
  window.dispatchEvent(new Event(COMMAND_PALETTE_TOGGLE_EVENT));
}
