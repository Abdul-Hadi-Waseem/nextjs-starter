import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { authKeys } from '@/features/auth/api/queries';
import { updateProfile } from './service';
import { teamKeys } from './queries';
import type { ProfilePayload } from './types';

export const updateProfileMutation = mutationOptions({
  mutationFn: (data: ProfilePayload) => updateProfile(data),
  onSuccess: (data) => {
    const queryClient = getQueryClient();
    // The response is the same shape as GET /auth/me, so write it straight into the cache.
    queryClient.setQueryData(authKeys.me(), data);
    queryClient.invalidateQueries({ queryKey: teamKeys.all });
  }
});
