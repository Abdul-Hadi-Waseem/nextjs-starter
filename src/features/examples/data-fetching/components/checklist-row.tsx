'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toggleChecklistItemMutation } from '../api/mutations';
import type { ChecklistItem } from '../../shared/api/types';

// One mutation per row, so each toggle gets its own success or error toast
// (mutate's per-call callbacks only fire for the latest call of a hook).
export function ChecklistRow({
  item,
  takeFailFlag
}: {
  item: ChecklistItem;
  takeFailFlag: () => boolean;
}) {
  const toggle = useMutation(toggleChecklistItemMutation);

  function onCheckedChange(done: boolean) {
    toggle.mutate(
      { id: item.id, done, fail: takeFailFlag() },
      {
        onSuccess: () => toast.success(done ? 'Task completed' : 'Task reopened'),
        onError: () => toast.error("Couldn't update the task. Change undone.")
      }
    );
  }

  return (
    <li>
      <label className='flex min-h-11 flex-1 cursor-pointer items-center gap-3'>
        <Checkbox checked={item.done} onCheckedChange={onCheckedChange} />
        <span
          className={cn(
            'transition-colors duration-150',
            item.done && 'text-muted-foreground line-through'
          )}
        >
          {item.title}
        </span>
      </label>
    </li>
  );
}
