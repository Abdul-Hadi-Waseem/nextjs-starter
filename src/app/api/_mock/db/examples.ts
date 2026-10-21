// In-memory data for the example routes. Resets when the server restarts.
import { CHECKLIST_MAX_ITEMS } from '@/features/examples/shared/constants/demo';
const BASE_RATES = { EUR: 0.92, GBP: 0.79, PKR: 278.4, AED: 3.67 } as const;
// Each response moves the rates a little, so a refetch is visible on the page.
const RATE_JITTER = 0.004;

export function exchangeRates() {
  return {
    base: 'USD',
    rates: Object.entries(BASE_RATES).map(([currency, rate]) => ({
      currency,
      rate: Math.round(rate * (1 + (Math.random() - 0.5) * RATE_JITTER) * 10_000) / 10_000
    })),
    fetchedAt: new Date().toISOString()
  };
}

export type ChecklistItem = { id: string; title: string; done: boolean };

// Shared by every demo user; a real backend stores this per account.
const checklist: ChecklistItem[] = [
  { id: 'bank', title: 'Verify bank details', done: true },
  { id: 'tax', title: 'Upload the tax form', done: false },
  { id: 'terms', title: 'Accept the payout terms', done: false },
  { id: 'contact', title: 'Add a billing contact', done: false }
];

export function getChecklist() {
  return checklist;
}

export function addChecklistItem(title: string) {
  const item = { id: crypto.randomUUID(), title, done: false };
  checklist.push(item);
  // Keep only the latest tasks: everyone shares this list on a demo deployment.
  if (checklist.length > CHECKLIST_MAX_ITEMS)
    checklist.splice(0, checklist.length - CHECKLIST_MAX_ITEMS);
  return item;
}

export function setChecklistItemDone(id: string, done: boolean) {
  const item = checklist.find((entry) => entry.id === id);
  if (item) item.done = done;
  return item ?? null;
}
