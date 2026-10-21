////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from 'match-sorter';
import { PARTNER_RECENT_PAYOUTS_LIMIT } from '@/features/partners/constants/partner-table';
import { fakePartners } from '@/app/api/_mock/db/partners';
import {
  MOCK_DELAY,
  createSeededFaker,
  delay,
  getReferenceDate,
  paginate,
  roundMoney,
  sortRecords,
  splitList
} from '@/app/api/_mock/db/utils';
import { PARTNER_STATUS } from '@/features/partners/constants/partner-options';
import {
  PAYOUT_CURRENCY,
  PAYOUT_METHOD,
  PAYOUT_STATUS
} from '@/features/payouts/constants/payout-options';
import type { Payout, PayoutPayload } from '@/features/payouts/api/types';
import type { PartnerStats } from '@/features/partners/api/types';

const PAYOUT_SEED = 7310;
const PAYOUT_COUNT = 120;
const DAY_MS = 24 * 60 * 60 * 1000;
const HISTORY_DAYS = 365;
const SCHEDULE_LEAD_DAYS = { min: 3, max: 14 } as const;
const PAID_LAG_DAYS = { min: 0, max: 2 } as const;
const AMOUNT_RANGE = { min: 250, max: 18_000 } as const;
const NOTE_PROBABILITY = 0.3;
const ID_LENGTH = 8;

const faker = createSeededFaker(PAYOUT_SEED);

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function byCreatedAtDesc(a: Payout, b: Payout) {
  return b.createdAt.localeCompare(a.createdAt);
}

function newPayoutId() {
  return `pay_${faker.string.alphanumeric({ length: ID_LENGTH, casing: 'lower' })}`;
}

function generatePayout(): Payout {
  const reference = getReferenceDate().getTime();
  const eligible = fakePartners.records.filter(
    (partner) => partner.status !== PARTNER_STATUS.PENDING
  );
  const partner = faker.helpers.arrayElement(eligible.length > 0 ? eligible : fakePartners.records);

  const createdAt = faker.date.between({ from: reference - HISTORY_DAYS * DAY_MS, to: reference });
  const scheduledFor = new Date(
    createdAt.getTime() + faker.number.int(SCHEDULE_LEAD_DAYS) * DAY_MS
  );
  const status =
    scheduledFor.getTime() > reference
      ? PAYOUT_STATUS.PENDING
      : faker.helpers.weightedArrayElement([
          { weight: 82, value: PAYOUT_STATUS.PAID },
          { weight: 8, value: PAYOUT_STATUS.FAILED },
          { weight: 10, value: PAYOUT_STATUS.PENDING }
        ]);
  const paidAt =
    status === PAYOUT_STATUS.PAID
      ? new Date(
          Math.min(scheduledFor.getTime() + faker.number.int(PAID_LAG_DAYS) * DAY_MS, reference)
        ).toISOString()
      : null;

  return {
    id: newPayoutId(),
    partnerId: partner.id,
    partnerName: partner.name,
    amount: roundMoney(faker.number.float({ ...AMOUNT_RANGE, fractionDigits: 2 })),
    currency: PAYOUT_CURRENCY.USD,
    status,
    method: faker.helpers.arrayElement(Object.values(PAYOUT_METHOD)),
    scheduledFor: toDateOnly(scheduledFor),
    paidAt,
    note: faker.datatype.boolean({ probability: NOTE_PROBABILITY }) ? faker.lorem.sentence() : null,
    createdAt: createdAt.toISOString()
  };
}

// Mock payout data store
export const fakePayouts = {
  records: [] as Payout[],

  initialize() {
    this.records = Array.from({ length: PAYOUT_COUNT }, () => generatePayout()).toSorted(
      byCreatedAtDesc
    );
    for (const partner of fakePartners.records) {
      this.syncPartnerTotal(partner.id);
    }
  },

  // Keeps Partner.payoutsTotal equal to the sum of that partner's paid payouts.
  syncPartnerTotal(partnerId: string) {
    const paidTotal = this.records
      .filter((payout) => payout.partnerId === partnerId && payout.status === PAYOUT_STATUS.PAID)
      .reduce((sum, payout) => sum + payout.amount, 0);
    fakePartners.setPayoutsTotal(partnerId, paidTotal);
  },

  getAll({
    statuses = [],
    partnerId,
    search
  }: {
    statuses?: string[];
    partnerId?: string;
    search?: string;
  }) {
    let payouts = [...this.records];

    if (statuses.length > 0) {
      payouts = payouts.filter((payout) => statuses.includes(payout.status));
    }

    if (partnerId) {
      payouts = payouts.filter((payout) => payout.partnerId === partnerId);
    }

    if (search) {
      payouts = matchSorter(payouts, search, {
        keys: ['partnerName', 'id', 'note']
      });
    }

    return payouts;
  },

  // Paginated results with status/partner filtering, search and sorting (newest first by default)
  async getPayouts({
    page = 1,
    limit = 10,
    status,
    partnerId,
    search,
    sort
  }: {
    page?: number;
    limit?: number;
    status?: string;
    partnerId?: string;
    search?: string;
    sort?: string;
  }) {
    await delay(MOCK_DELAY.LIST);

    const allPayouts = sortRecords(
      this.getAll({ statuses: splitList(status), partnerId, search }).toSorted(byCreatedAtDesc),
      sort
    );
    const { offset, limit: pageLimit, items } = paginate(allPayouts, page, limit);

    return {
      success: true,
      time: new Date().toISOString(),
      message: 'Sample data for testing and learning purposes',
      total_payouts: allPayouts.length,
      offset,
      limit: pageLimit,
      payouts: items
    };
  },

  async getPayoutById(id: string) {
    await delay(MOCK_DELAY.DETAIL);

    const payout = this.records.find((record) => record.id === id);

    if (!payout) {
      return { success: false as const, message: `Payout with ID ${id} not found` };
    }

    return { success: true as const, payout };
  },

  // Latest payouts and totals for one partner (used by the partner detail endpoint)
  getPartnerActivity(partnerId: string): { recentPayouts: Payout[]; stats: PartnerStats } {
    const payouts = this.records
      .filter((payout) => payout.partnerId === partnerId)
      .toSorted(byCreatedAtDesc);
    const sumBy = (status: Payout['status']) =>
      roundMoney(
        payouts
          .filter((payout) => payout.status === status)
          .reduce((sum, payout) => sum + payout.amount, 0)
      );

    return {
      recentPayouts: payouts.slice(0, PARTNER_RECENT_PAYOUTS_LIMIT),
      stats: {
        paidTotal: sumBy(PAYOUT_STATUS.PAID),
        pendingTotal: sumBy(PAYOUT_STATUS.PENDING),
        payoutCount: payouts.length
      }
    };
  },

  // Callers validate that the partner exists first.
  async createPayout(data: PayoutPayload) {
    await delay(MOCK_DELAY.MUTATION);

    const partner = fakePartners.findById(data.partnerId);
    if (!partner) {
      return { success: false as const, message: `Partner with ID ${data.partnerId} not found` };
    }

    const status = data.status ?? PAYOUT_STATUS.PENDING;
    const now = new Date().toISOString();
    const payout: Payout = {
      id: newPayoutId(),
      partnerId: partner.id,
      partnerName: partner.name,
      amount: roundMoney(data.amount),
      currency: PAYOUT_CURRENCY.USD,
      status,
      method: data.method,
      scheduledFor: toDateOnly(new Date(data.scheduledFor)),
      paidAt: status === PAYOUT_STATUS.PAID ? now : null,
      note: data.note?.trim() || null,
      createdAt: now
    };

    this.records.unshift(payout);
    this.syncPartnerTotal(partner.id);

    return { success: true as const, message: 'Payout created successfully', payout };
  },

  async updatePayout(id: string, data: PayoutPayload) {
    await delay(MOCK_DELAY.MUTATION);

    const index = this.records.findIndex((payout) => payout.id === id);
    if (index === -1) {
      return { success: false as const, message: `Payout with ID ${id} not found` };
    }

    const partner = fakePartners.findById(data.partnerId);
    if (!partner) {
      return { success: false as const, message: `Partner with ID ${data.partnerId} not found` };
    }

    const current = this.records[index];
    const status = data.status ?? current.status;
    const paidAt =
      status === PAYOUT_STATUS.PAID ? (current.paidAt ?? new Date().toISOString()) : null;

    this.records[index] = {
      ...current,
      partnerId: partner.id,
      partnerName: partner.name,
      amount: roundMoney(data.amount),
      status,
      method: data.method,
      scheduledFor: toDateOnly(new Date(data.scheduledFor)),
      paidAt,
      note: data.note === undefined ? current.note : data.note?.trim() || null
    };

    this.syncPartnerTotal(current.partnerId);
    if (partner.id !== current.partnerId) this.syncPartnerTotal(partner.id);

    return {
      success: true as const,
      message: 'Payout updated successfully',
      payout: this.records[index]
    };
  },

  async deletePayout(id: string) {
    await delay(MOCK_DELAY.MUTATION);

    const index = this.records.findIndex((payout) => payout.id === id);
    if (index === -1) {
      return { success: false as const, message: `Payout with ID ${id} not found` };
    }

    const [removed] = this.records.splice(index, 1);
    this.syncPartnerTotal(removed.partnerId);

    return { success: true as const, message: 'Payout deleted successfully' };
  }
};

// Initialize sample payouts (after partners, which this store reads from)
fakePayouts.initialize();
