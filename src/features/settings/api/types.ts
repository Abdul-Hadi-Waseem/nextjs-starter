import type { Role } from '@/features/auth/constants/auth';
import type { AuthResponse } from '@/features/auth/api/types';

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  joinedAt: string;
};

export type TeamResponse = {
  success: boolean;
  members: TeamMember[];
};

export type ProfilePayload = {
  name: string;
};

export type ProfileResponse = AuthResponse;
