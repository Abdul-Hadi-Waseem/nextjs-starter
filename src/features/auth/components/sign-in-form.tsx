'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { AUTH, isApiError } from '@/lib/api';
import { useAppForm } from '@/lib/form';
import { loginMutation } from '../api/mutations';
import { DEMO_ADMIN } from '../constants';
import { loginSchema, type LoginFormValues } from '../schemas/login';

// Only follow same-site relative paths, never `//evil.com` or absolute URLs.
function safeNextPath(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : AUTH.homePath;
}

export function SignInForm({ showDemoHint }: { showDemoHint: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mutation = useMutation({
    ...loginMutation,
    onSuccess: (data, variables, onMutateResult, context) => {
      loginMutation.onSuccess?.(data, variables, onMutateResult, context);
      router.replace(safeNextPath(searchParams.get('next')));
      router.refresh();
    }
  });

  const form = useAppForm({
    defaultValues: { email: '', password: '' } as LoginFormValues,
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value).catch(() => undefined);
    }
  });

  const errorMessage = mutation.error
    ? isApiError(mutation.error)
      ? mutation.error.message
      : "Couldn't reach the server. Check your connection and try again."
    : null;

  return (
    <div className='space-y-6'>
      <div className='space-y-1.5'>
        <h1 className='text-2xl font-semibold tracking-tight'>Sign in</h1>
        <p className='text-muted-foreground text-sm'>Enter your email and password to continue.</p>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField
            name='email'
            children={(field) => (
              <field.TextField
                label='Email'
                type='email'
                autoComplete='email'
                placeholder='you@company.com'
                required
              />
            )}
          />
          <form.AppField
            name='password'
            children={(field) => (
              <field.PasswordField label='Password' autoComplete='current-password' required />
            )}
          />

          {errorMessage && (
            <p role='alert' className='text-destructive flex items-center gap-2 text-sm'>
              <Icons.alertCircle className='size-4 shrink-0' />
              {errorMessage}
            </p>
          )}

          <form.AppForm>
            <form.SubmitButton className='w-full'>Sign in</form.SubmitButton>
          </form.AppForm>
        </FieldGroup>
      </form>

      {showDemoHint && (
        <div className='bg-muted/60 text-muted-foreground space-y-2 rounded-lg border border-dashed p-3 text-sm'>
          <p>
            Demo mode: any email and password works. Emails starting with
            <span className='text-foreground font-medium'> admin </span>
            sign in as admin.
          </p>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              form.setFieldValue('email', DEMO_ADMIN.email);
              form.setFieldValue('password', DEMO_ADMIN.password);
            }}
          >
            Fill demo admin
          </Button>
        </div>
      )}
    </div>
  );
}
