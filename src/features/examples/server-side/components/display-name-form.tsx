'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useActionState, useEffect, useId } from 'react';
import { toast } from 'sonner';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import { authKeys } from '@/features/auth/api/queries';
import { updateDisplayName } from '../actions/update-display-name';
import {
  ACTION_STATUS,
  DISPLAY_NAME_FIELD,
  DISPLAY_NAME_INITIAL_STATE
} from '../constants/display-name-form';

export function DisplayNameForm({ currentName }: { currentName: string }) {
  const inputId = useId();
  const errorId = useId();
  const queryClient = useQueryClient();

  // The action itself goes to useActionState, so the form also posts without JavaScript.
  const [state, formAction, isPending] = useActionState(
    updateDisplayName,
    DISPLAY_NAME_INITIAL_STATE
  );

  // Client side effects of a finished submit (each submit returns a new state object).
  useEffect(() => {
    if (state.status === ACTION_STATUS.SUCCESS) {
      toast.success(state.message);
      // The sidebar reads the user from TanStack Query, which the server refresh doesn't touch.
      void queryClient.invalidateQueries({ queryKey: authKeys.me() });
    } else if (state.status === ACTION_STATUS.ERROR && state.message) {
      toast.error(state.message);
    }
  }, [state, queryClient]);

  const nameErrors = state.fieldErrors?.name;

  return (
    <form action={formAction} className='grid gap-4' noValidate>
      <Field data-invalid={nameErrors ? true : undefined}>
        <FieldLabel htmlFor={inputId}>Display name</FieldLabel>
        <Input
          id={inputId}
          name={DISPLAY_NAME_FIELD}
          // key resets the uncontrolled input to the saved or last typed value after each submit.
          key={state.name ?? currentName}
          defaultValue={state.name ?? currentName}
          autoComplete='name'
          aria-invalid={nameErrors ? true : undefined}
          aria-describedby={nameErrors ? errorId : undefined}
        />
        {nameErrors && (
          <FieldError id={errorId} errors={nameErrors.map((message) => ({ message }))} />
        )}
      </Field>
      <LoadingButton
        type='submit'
        loading={isPending}
        loadingLabel='Saving name'
        className='w-fit motion-safe:active:scale-[0.98]'
      >
        Save name
      </LoadingButton>
    </form>
  );
}
