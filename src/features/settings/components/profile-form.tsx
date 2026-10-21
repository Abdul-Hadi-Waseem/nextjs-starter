'use client';

import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';
import { meQueryOptions } from '@/features/auth/api/queries';
import { useAppForm } from '@/lib/form';
import { updateProfileMutation } from '../api/mutations';
import { PROFILE_NAME_LENGTH } from '../constants/profile';
import { profileSchema } from '../schemas/profile';

/**
 * Edits server data with TanStack Form: defaults come from `/auth/me`, the mutation writes
 * the response back into that cache, so the sidebar shows the new name right away.
 */
export function ProfileForm() {
  const { data } = useSuspenseQuery(meQueryOptions());
  const { user } = data;

  const mutation = useMutation(updateProfileMutation);

  const form = useAppForm({
    defaultValues: { name: user.name },
    validators: { onSubmit: profileSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await mutation.mutateAsync(profileSchema.parse(value), {
          onSuccess: () => toast.success('Profile updated'),
          onError: () => toast.error("Couldn't update your profile. Try again.")
        });
        // The saved name becomes the new baseline, so "Save changes" disables again.
        formApi.reset({ name: result.user.name });
      } catch {
        // onError already showed a toast; keep the edit so the user can retry.
      }
    }
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField
          name='name'
          children={(field) => (
            <field.TextField
              label='Name'
              autoComplete='name'
              maxLength={PROFILE_NAME_LENGTH.MAX}
              description='Shown in the sidebar and to your team.'
            />
          )}
        />
        <Field>
          <FieldLabel htmlFor='profile-email'>Email</FieldLabel>
          <Input
            id='profile-email'
            type='email'
            value={user.email}
            readOnly
            aria-describedby='profile-email-description'
            className='text-muted-foreground'
          />
          <FieldDescription id='profile-email-description'>
            You sign in with this address. It can't be changed here.
          </FieldDescription>
        </Field>
        <form.Subscribe
          selector={(state) => [state.isDefaultValue, state.isSubmitting] as const}
          children={([isDefaultValue, isSubmitting]) => (
            <div>
              <LoadingButton
                type='submit'
                loading={isSubmitting}
                loadingLabel='Saving profile…'
                disabled={isDefaultValue}
                className='motion-safe:active:scale-[0.98]'
              >
                Save changes
              </LoadingButton>
            </div>
          )}
        />
      </FieldGroup>
    </form>
  );
}
