////////////////////////////////////////////////////////////////////////////////
// 🛑 Shared helpers for the fake databases in src/app/api/_mock/db/*.ts
////////////////////////////////////////////////////////////////////////////////

import { Faker, base, en } from '@faker-js/faker';
import { toOffset } from '@/lib/pagination';

export const MOCK_DELAY = {
  LIST: 800,
  DETAIL: 600,
  MUTATION: 800
} as const;

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

export type SortItem = { id: string; desc: boolean };

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Each store owns a seeded Faker instance so its data is the same on every restart
// and does not depend on which store happens to load first.
export function createSeededFaker(seed: number) {
  const faker = new Faker({ locale: [en, base] });
  faker.seed(seed);
  return faker;
}

// Dates are generated relative to the start of today (UTC), so they stay stable
// for the whole day and the "last 12 months" window keeps moving with time.
export function getReferenceDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

// "a,b" or "a.b" → ['a', 'b'] (multi-select filter values from the URL)
export function splitList(value?: string | string[]) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(/[.,]/).filter(Boolean);
}

// Accepts both formats `getSortingStateParser` produces: JSON (`[{"id":"name","desc":true}]`)
// and the compact form (`name.desc,revenue.asc`).
export function parseSort(sort?: string): SortItem[] {
  if (!sort) return [];
  try {
    const parsed = JSON.parse(sort) as SortItem[];
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not JSON — try the compact form below.
  }
  return sort
    .split(',')
    .map((part) => {
      const index = part.lastIndexOf('.');
      if (index <= 0) return null;
      const direction = part.slice(index + 1);
      if (direction !== SORT_DIRECTION.ASC && direction !== SORT_DIRECTION.DESC) return null;
      return { id: part.slice(0, index), desc: direction === SORT_DIRECTION.DESC };
    })
    .filter((item): item is SortItem => item !== null);
}

// Returns a copy sorted by the first sort item.
export function sortRecords<T extends object>(records: T[], sort?: string) {
  const [first] = parseSort(sort);
  if (!first) return records;
  const { id, desc } = first;
  return records.toSorted((a, b) => {
    const aVal = (a as Record<string, unknown>)[id];
    const bVal = (b as Record<string, unknown>)[id];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return desc ? bVal - aVal : aVal - bVal;
    }
    const aStr = String(aVal ?? '').toLowerCase();
    const bStr = String(bVal ?? '').toLowerCase();
    return desc ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
  });
}

export function paginate<T>(records: T[], page = 1, limit = 10) {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
  const offset = toOffset(safePage, safeLimit);
  return { offset, limit: safeLimit, items: records.slice(offset, offset + safeLimit) };
}
