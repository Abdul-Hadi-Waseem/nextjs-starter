'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { Partner } from '../../api/types';
import { PARTNER_ROUTES } from '../../constants/partner-routes';

export function CellAction({ data }: { data: Partner }) {
  const router = useRouter();

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(data.email);
      toast.success('Email copied');
    } catch {
      toast.error("Couldn't copy the email. Copy it from the partner page.");
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger render={<Button variant='ghost' className='h-8 w-8 p-0' />}>
        <span className='sr-only'>Actions for {data.name}</span>
        <Icons.ellipsis className='h-4 w-4' aria-hidden='true' />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(PARTNER_ROUTES.detail(data.id))}>
            <Icons.user className='mr-2 h-4 w-4' aria-hidden='true' /> View partner
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyEmail}>
            <Icons.copy className='mr-2 h-4 w-4' aria-hidden='true' /> Copy email
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
