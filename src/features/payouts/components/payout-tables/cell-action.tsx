'use client';

import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LoadingButton } from '@/components/ui/loading-button';
import { Icons } from '@/components/icons';
import { formatCurrency } from '@/lib/format';
import { deletePayoutMutation, updatePayoutMutation } from '../../api/mutations';
import type { Payout } from '../../api/types';
import { PAYOUT_STATUS } from '../../constants/payout-options';
import { toStatusPayload } from '../../lib/payout-form';
import { usePayoutSheet } from '../payout-sheet';

export function CellAction({ payout }: { payout: Payout }) {
  const { openEdit } = usePayoutSheet();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const amount = formatCurrency(payout.amount, payout.currency);

  // Per-call callbacks run after the mutation's own onSuccess (cache invalidation).
  const markPaidMutation = useMutation(updatePayoutMutation);
  const deleteMutation = useMutation(deletePayoutMutation);

  function markAsPaid() {
    markPaidMutation.mutate(
      { id: payout.id, values: toStatusPayload(payout, PAYOUT_STATUS.PAID) },
      {
        onSuccess: () => toast.success('Payout marked as paid'),
        onError: () => toast.error("Couldn't mark the payout as paid. Try again.")
      }
    );
  }

  function deletePayout() {
    deleteMutation.mutate(payout.id, {
      onSuccess: () => {
        toast.success('Payout deleted');
        setConfirmOpen(false);
      },
      onError: () => toast.error("Couldn't delete the payout. Try again.")
    });
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          render={<Button variant='ghost' size='icon-sm' className='ms-auto flex' />}
        >
          <span className='sr-only'>Actions for payout {payout.id}</span>
          <Icons.ellipsis aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-44'>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => openEdit(payout)}>
              <Icons.edit aria-hidden /> Edit
            </DropdownMenuItem>
            {payout.status === PAYOUT_STATUS.PENDING && (
              <DropdownMenuItem disabled={markPaidMutation.isPending} onClick={markAsPaid}>
                <Icons.circleCheck aria-hidden /> Mark as paid
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant='destructive' onClick={() => setConfirmOpen(true)}>
              <Icons.trash aria-hidden /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(next) => {
          // Stay open while the delete is in flight.
          if (!deleteMutation.isPending) setConfirmOpen(next);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete payout {amount} to {payout.partnerName}?
            </AlertDialogTitle>
            <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <LoadingButton
              variant='destructive'
              loading={deleteMutation.isPending}
              loadingLabel='Deleting payout…'
              onClick={deletePayout}
            >
              Delete payout
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
