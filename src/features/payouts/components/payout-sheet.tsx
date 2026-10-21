'use client';

import * as React from 'react';
import { useQueryStates } from 'nuqs';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import type { Payout } from '../api/types';
import { payoutSheetParsers } from '../lib/search-params';

// The form (TanStack Form + cmdk combobox + react-day-picker) is its own chunk,
// fetched the first time the sheet opens — or earlier, when the pointer or
// focus reaches the "New payout" button (see preloadPayoutForm). The sheet
// itself is a portal, so nothing inside it renders on the server.
const loadPayoutForm = () => import('./payout-form');
const PayoutForm = React.lazy(async () => ({ default: (await loadPayoutForm()).PayoutForm }));

export function preloadPayoutForm() {
  void loadPayoutForm();
}

type PayoutSheetActions = {
  openNew: () => void;
  openEdit: (payout: Payout) => void;
};

const PayoutSheetContext = React.createContext<PayoutSheetActions | null>(null);

export function usePayoutSheet() {
  const context = React.use(PayoutSheetContext);
  if (!context) throw new Error('usePayoutSheet must be used within <PayoutSheetProvider>');
  return context;
}

/**
 * Owns the payout sheet. "New" is URL state (`?new=1`, with `?partner=` as the
 * preselected partner) so other pages can deep-link to it; "edit" is local
 * state, opened from a row's actions.
 */
export function PayoutSheetProvider({ children }: { children: React.ReactNode }) {
  const [{ new: isNew, partner }, setSheetParams] = useQueryStates(payoutSheetParsers);
  const [editing, setEditing] = React.useState<Payout | null>(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const open = isNew === true || isEditOpen;

  const openNew = React.useCallback(() => {
    setIsEditOpen(false);
    setEditing(null);
    void setSheetParams({ new: true });
  }, [setSheetParams]);

  const openEdit = React.useCallback(
    (payout: Payout) => {
      void setSheetParams({ new: null });
      setEditing(payout);
      setIsEditOpen(true);
    },
    [setSheetParams]
  );

  const close = React.useCallback(() => {
    setIsEditOpen(false);
    void setSheetParams({ new: null });
  }, [setSheetParams]);

  const actions = React.useMemo(() => ({ openNew, openEdit }), [openNew, openEdit]);

  return (
    <PayoutSheetContext value={actions}>
      {children}
      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (!next) close();
        }}
        // Keep the edited payout until the close animation ends, so the title doesn't flip.
        onOpenChangeComplete={(next) => {
          if (!next) setEditing(null);
        }}
      >
        <SheetContent className='w-full sm:max-w-md'>
          <SheetHeader className='pr-12'>
            <SheetTitle>{editing ? 'Edit payout' : 'New payout'}</SheetTitle>
            <SheetDescription>
              {editing
                ? `Change the details of this payout to ${editing.partnerName}.`
                : 'Schedule a payment to a partner. It stays pending until you mark it as paid.'}
            </SheetDescription>
          </SheetHeader>
          <React.Suspense fallback={<PayoutFormSkeleton />}>
            <PayoutForm
              key={editing?.id ?? 'new'}
              payout={editing}
              defaultPartnerId={partner}
              onClose={close}
            />
          </React.Suspense>
        </SheetContent>
      </Sheet>
    </PayoutSheetContext>
  );
}

// Same rhythm as the form: four input-sized fields, the note, then the footer buttons.
const INPUT_FIELD_COUNT = 4;

function PayoutFormSkeleton() {
  return (
    <div role='status' className='flex flex-1 flex-col'>
      <span className='sr-only'>Loading form…</span>
      <div aria-hidden className='flex flex-1 flex-col gap-5 px-4'>
        {Array.from({ length: INPUT_FIELD_COUNT }, (_, index) => (
          <div key={index} className='flex flex-col gap-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-8 w-full' />
          </div>
        ))}
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-16 w-full' />
        </div>
      </div>
      <div aria-hidden className='mt-auto flex flex-col gap-2 p-4'>
        <Skeleton className='h-8 w-full' />
        <Skeleton className='h-8 w-full' />
      </div>
    </div>
  );
}
