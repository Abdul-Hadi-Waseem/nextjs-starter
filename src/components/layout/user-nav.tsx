'use client';

import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { logoutMutation } from '@/features/auth/api/mutations';
import { AUTH } from '@/lib/api';

export function UserNav() {
  const mutation = useMutation({
    ...logoutMutation,
    onSettled: (data, error, variables, onMutateResult, context) => {
      logoutMutation.onSettled?.(data, error, variables, onMutateResult, context);
      window.location.assign(AUTH.signInPath);
    }
  });

  if (!AUTH.enabled) return null;

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      aria-label='Log out'
    >
      <Icons.logout />
    </Button>
  );
}
