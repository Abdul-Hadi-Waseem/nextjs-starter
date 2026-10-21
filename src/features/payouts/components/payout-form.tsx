'use client';

// Loaded lazily by payout-sheet.tsx — keep heavy imports (combobox, date picker) here.
import * as React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '@/components/ui/input-group';
import { LoadingButton } from '@/components/ui/loading-button';
import { SheetFooter } from '@/components/ui/sheet';
import { ComboboxField } from '@/components/forms/fields/combobox-field';
import { DatePickerField } from '@/components/forms/fields/date-picker-field';
import { Icons } from '@/components/icons';
import { isApiError } from '@/lib/api';
import { useAppForm } from '@/lib/form';
import { partnersQueryOptions } from '@/features/partners/api/queries';
import { createPayoutMutation, updatePayoutMutation } from '../api/mutations';
import type { Payout } from '../api/types';
import {
  PAYOUT_CURRENCY,
  PAYOUT_NOTE_MAX_LENGTH,
  payoutMethodOptions
} from '../constants/payout-options';
import {
  PAYOUT_FORM_ID,
  PAYOUT_FORM_SUCCESS_MS,
  PAYOUT_PARTNER_OPTIONS_LIMIT
} from '../constants/payout-table';
import {
  getApiFieldErrors,
  getCurrencySymbol,
  getPayoutFormDefaults,
  isPayoutFormField,
  toPayoutPayload
} from '../lib/payout-form';
import { payoutFormSchema } from '../schemas/payout';

const GENERIC_ERROR = "Couldn't save the payout. Check your connection and try again.";
const PARTNER_OPTIONS_FILTERS = { limit: PAYOUT_PARTNER_OPTIONS_LIMIT };
const CURRENCY_SYMBOL = getCurrencySymbol(PAYOUT_CURRENCY.USD);

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

interface PayoutFormProps {
  /** The payout being edited; `null` creates a new one. */
  payout: Payout | null;
  /** Preselected partner for a new payout (from `?partner=`). */
  defaultPartnerId: string | null;
  onClose: () => void;
}

export function PayoutForm({ payout, defaultPartnerId, onClose }: PayoutFormProps) {
  const isEdit = payout !== null;
  const [formError, setFormError] = React.useState<string | null>(null);
  const [succeeded, setSucceeded] = React.useState(false);

  const createMutation = useMutation(createPayoutMutation);
  const updateMutation = useMutation(updatePayoutMutation);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const partnersQuery = useQuery(partnersQueryOptions(PARTNER_OPTIONS_FILTERS));
  const partnerOptions = React.useMemo(() => {
    const options = (partnersQuery.data?.partners ?? []).map((partner) => ({
      value: partner.id,
      label: partner.name
    }));
    // The edited payout's partner may be outside the first page; keep its name visible.
    if (payout && !options.some((option) => option.value === payout.partnerId)) {
      options.unshift({ value: payout.partnerId, label: payout.partnerName });
    }
    return options;
  }, [partnersQuery.data, payout]);

  // New payouts can't be scheduled in the past; edits keep whatever date they had.
  const disabledDates = React.useMemo(() => {
    if (isEdit) return undefined;
    const today = startOfToday();
    return (date: Date) => date < today;
  }, [isEdit]);

  const form = useAppForm({
    defaultValues: getPayoutFormDefaults(payout, defaultPartnerId),
    validators: { onSubmit: payoutFormSchema },
    onSubmit: async ({ value, formApi }) => {
      setFormError(null);
      const payload = toPayoutPayload(payoutFormSchema.parse(value));

      try {
        if (payout) {
          await updateMutation.mutateAsync({ id: payout.id, values: payload });
        } else {
          await createMutation.mutateAsync(payload);
        }
      } catch (error) {
        const fieldErrors = getApiFieldErrors(error);
        if (!fieldErrors) {
          setFormError(isApiError(error) && error.isClientError ? error.message : GENERIC_ERROR);
          return;
        }

        // Paint server-side field errors like the schema's own: on submit, from the form,
        // so the next submit re-validates and clears them.
        const otherMessages: string[] = [];
        for (const [name, messages] of Object.entries(fieldErrors)) {
          if (!isPayoutFormField(name)) {
            otherMessages.push(...messages);
            continue;
          }
          formApi.setFieldMeta(name, (prev) => ({
            ...prev,
            errorMap: { ...prev.errorMap, onSubmit: messages.map((message) => ({ message })) },
            errorSourceMap: { ...prev.errorSourceMap, onSubmit: 'form' }
          }));
        }
        if (otherMessages.length > 0) setFormError(otherMessages.join(' '));
        return;
      }

      toast.success(isEdit ? 'Payout updated' : 'Payout created');
      setSucceeded(true);
    }
  });

  // Show the check mark briefly, then close the sheet.
  React.useEffect(() => {
    if (!succeeded) return;
    const timer = window.setTimeout(onClose, PAYOUT_FORM_SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [succeeded, onClose]);

  return (
    <>
      <div className='flex-1 overflow-y-auto px-4'>
        <form
          id={PAYOUT_FORM_ID}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            {formError && (
              <Alert variant='destructive'>
                <Icons.alertCircle aria-hidden />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <form.AppField
              name='partnerId'
              children={() => (
                <ComboboxField
                  label='Partner'
                  required
                  options={partnerOptions}
                  placeholder={partnersQuery.isPending ? 'Loading partners…' : 'Select a partner'}
                  searchPlaceholder='Search partners…'
                  emptyMessage={
                    partnersQuery.isError ? "Couldn't load partners." : 'No partners found.'
                  }
                />
              )}
            />

            <form.Field
              name='amount'
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                const errorId = `${field.name}-error`;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Amount *</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>{CURRENCY_SYMBOL}</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        type='number'
                        inputMode='decimal'
                        min={0}
                        step='0.01'
                        placeholder='0.00'
                        className='tabular-nums'
                        value={field.state.value ?? ''}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(
                            event.target.value === '' ? undefined : Number(event.target.value)
                          )
                        }
                        aria-invalid={isInvalid}
                        aria-describedby={isInvalid ? errorId : undefined}
                      />
                      <InputGroupAddon align='inline-end'>
                        <InputGroupText>{PAYOUT_CURRENCY.USD}</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && <FieldError id={errorId} errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <form.AppField
              name='scheduledFor'
              children={() => (
                <DatePickerField
                  label='Scheduled for'
                  required
                  placeholder='Pick a date'
                  disabledDates={disabledDates}
                />
              )}
            />

            <form.AppField
              name='method'
              children={(field) => (
                <field.SelectField
                  label='Method'
                  required
                  placeholder='Select a method'
                  options={payoutMethodOptions}
                />
              )}
            />

            <form.AppField
              name='note'
              children={(field) => (
                <field.TextareaField
                  label='Note'
                  description='Optional. For your own records.'
                  placeholder='Invoice number or billing period'
                  maxLength={PAYOUT_NOTE_MAX_LENGTH}
                  showCount
                />
              )}
            />
          </FieldGroup>
        </form>
      </div>

      <SheetFooter>
        <LoadingButton
          type='submit'
          form={PAYOUT_FORM_ID}
          loading={isPending}
          loadingLabel={isEdit ? 'Saving changes…' : 'Creating payout…'}
          success={succeeded}
          successLabel={isEdit ? 'Payout updated' : 'Payout created'}
          className='motion-safe:active:scale-[0.98]'
        >
          {isEdit ? 'Save changes' : 'Create payout'}
        </LoadingButton>
        <Button type='button' variant='outline' onClick={onClose}>
          Cancel
        </Button>
      </SheetFooter>
    </>
  );
}
