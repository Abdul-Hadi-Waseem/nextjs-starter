import type { Permission, Role } from '../constants/auth';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  user: AuthUser;
};
