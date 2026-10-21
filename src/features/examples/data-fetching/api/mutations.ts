import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { exampleKeys } from '../../shared/api/queries';
import { addChecklistItem, setChecklistItemDone } from '../../shared/api/service';
import type { ChecklistResponse } from '../../shared/api/types';

// Mutation keys let other components read these mutations (useIsMutating, useMutationState).
export const checklistMutationKeys = {
  all: [...exampleKeys.checklist(), 'mutation'] as const,
  toggle: () => [...checklistMutationKeys.all, 'toggle'] as const,
  add: () => [...checklistMutationKeys.all, 'add'] as const
};

// Refetch once the last checklist write finishes, so an earlier answer can't
// overwrite a later optimistic change.
function invalidateChecklistWhenIdle() {
  const queryClient = getQueryClient();
  if (queryClient.isMutating({ mutationKey: checklistMutationKeys.all }) === 1) {
    return queryClient.invalidateQueries({ queryKey: exampleKeys.checklist() });
  }
}

// Pattern 1, cache update: write the new value into the cache before the server
// answers, keep a snapshot, and put it back if the request fails.
export const toggleChecklistItemMutation = mutationOptions({
  mutationKey: checklistMutationKeys.toggle(),
  mutationFn: setChecklistItemDone,
  onMutate: async ({ id, done }) => {
    const queryClient = getQueryClient();
    const queryKey = exampleKeys.checklist();
    // A refetch in flight would overwrite the optimistic value when it lands.
    await queryClient.cancelQueries({ queryKey });
    const previous = queryClient.getQueryData<ChecklistResponse>(queryKey);
    queryClient.setQueryData<ChecklistResponse>(queryKey, (old) =>
      old ? { items: old.items.map((item) => (item.id === id ? { ...item, done } : item)) } : old
    );
    return { previous };
  },
  onError: (_error, _variables, context) => {
    if (context?.previous) {
      getQueryClient().setQueryData(exampleKeys.checklist(), context.previous);
    }
  },
  onSettled: invalidateChecklistWhenIdle
});

// Pattern 2, pending variables: nothing is written before the answer; the list renders
// the pending `variables` (via useMutationState). On success the saved row goes into the
// cache, so it shows even while other writes delay the refetch.
export const addChecklistItemMutation = mutationOptions({
  mutationKey: checklistMutationKeys.add(),
  mutationFn: addChecklistItem,
  onSuccess: ({ item }) => {
    getQueryClient().setQueryData<ChecklistResponse>(exampleKeys.checklist(), (old) =>
      old ? { items: [...old.items, item] } : old
    );
  },
  onSettled: invalidateChecklistWhenIdle
});
