'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { AUTH, isApiError } from '@/lib/api';
import { useAppForm } from '@/lib/form';
import { loginMutation } from '../api/mutations';
import { loginSchema, type LoginFormValues } from '../schemas/login';

// Only follow same-site relative paths, never `//evil.com` or absolute URLs.
function safeNextPath(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : AUTH.homePath;
}

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mutation = useMutation({
    ...loginMutation,
    onSuccess: (data, variables, onMutateResult, context) => {
      loginMutation.onSuccess?.(data, variables, onMutateResult, context);
      router.replace(safeNextPath(searchParams.get('next')));
      router.refresh();
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : "Couldn't sign in. Try again.");
    }
  });

  const form = useAppForm({
    defaultValues: { email: '', password: '' } as LoginFormValues,
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value).catch(() => undefined);
    }
  });

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your email and password to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField
              name='email'
              children={(field) => (
                <field.TextField label='Email' type='email' autoComplete='email' required />
              )}
            />
            <form.AppField
              name='password'
              children={(field) => (
                <field.TextField
                  label='Password'
                  type='password'
                  autoComplete='current-password'
                  required
                />
              )}
            />
            <form.AppForm>
              <form.SubmitButton className='w-full'>Sign in</form.SubmitButton>
            </form.AppForm>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
