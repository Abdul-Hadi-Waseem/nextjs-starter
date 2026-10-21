'use client';

import { useMutation } from '@tanstack/react-query';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { addChecklistItemMutation } from '../api/mutations';
import { ExampleCard } from '../../shared/components/example-card';
import { TASK_TITLE_MAX_LENGTH } from '../../shared/constants/demo';

const COPY = {
  title: 'Render the pending input',
  description:
    "A new task shows from the mutation's variables while it saves; a failure just removes it.",
  source: 'src/features/examples/data-fetching/components/add-task-card.tsx'
} as const;

export function AddTaskCard({ takeFailFlag }: { takeFailFlag: () => boolean }) {
  const inputId = useId();
  const [title, setTitle] = useState('');
  const addTask = useMutation(addChecklistItemMutation);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = title.trim();
    if (!value) return;
    setTitle('');
    // mutateAsync: each call gets its own outcome, even when several are in flight.
    addTask.mutateAsync({ title: value, fail: takeFailFlag() }).then(
      () => toast.success('Task added'),
      () => toast.error("Couldn't add the task. Try again.")
    );
  }

  return (
    <ExampleCard {...COPY}>
      <form onSubmit={onSubmit} className='grid gap-1.5'>
        <Label htmlFor={inputId}>New task</Label>
        <div className='flex gap-2'>
          <Input
            id={inputId}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={TASK_TITLE_MAX_LENGTH}
            placeholder='Send the welcome email'
            autoComplete='off'
          />
          <Button
            type='submit'
            disabled={!title.trim()}
            className='motion-safe:active:scale-[0.98]'
          >
            <Icons.add aria-hidden />
            Add task
          </Button>
        </div>
      </form>
    </ExampleCard>
  );
}

export function AddTaskCardSkeleton() {
  return (
    <ExampleCard {...COPY}>
      <div className='grid gap-1.5'>
        <Label>New task</Label>
        <div className='flex gap-2'>
          <Skeleton className='h-8 flex-1' />
          <Skeleton className='h-8 w-24' />
        </div>
      </div>
    </ExampleCard>
  );
}
