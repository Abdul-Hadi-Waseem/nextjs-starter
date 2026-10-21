import type { Role } from '@/features/auth/constants/auth';

export type ExchangeRate = { currency: string; rate: number };

export type ExchangeRates = {
  base: string;
  rates: ExchangeRate[];
  /** ISO time the backend built this answer, to make caching visible. */
  fetchedAt: string;
};

export type AccountSummary = {
  name: string;
  email: string;
  role: Role;
  fetchedAt: string;
};

export type ChecklistItem = { id: string; title: string; done: boolean };

export type ChecklistResponse = { items: ChecklistItem[] };

/** `fail: true` asks the mock to answer 500, to show the rollback. */
export type ToggleChecklistItem = { id: string; done: boolean; fail: boolean };

export type AddChecklistItem = { title: string; fail: boolean };
