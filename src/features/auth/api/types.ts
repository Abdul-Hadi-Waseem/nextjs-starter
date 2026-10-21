import type { Role } from '../constants';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  permissions: string[];
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  user: AuthUser;
};
