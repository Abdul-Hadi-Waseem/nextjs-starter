import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { login, logout } from './service';
import { authKeys } from './queries';
import type { LoginPayload } from './types';

export const loginMutation = mutationOptions({
  mutationFn: (data: LoginPayload) => login(data),
  onSuccess: (data) => {
    getQueryClient().setQueryData(authKeys.me(), data);
  }
});

export const logoutMutation = mutationOptions({
  mutationFn: () => logout(),
  // Whatever the server says, nothing cached should outlive the session.
  onSettled: () => {
    getQueryClient().clear();
  }
});
