////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from 'match-sorter';
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
import {
  PARTNER_STATUS,
  PARTNER_TIER,
  type PartnerTier
} from '@/features/partners/constants/partner-options';
import type { Partner } from '@/features/partners/api/types';

const PARTNER_SEED = 4821;
const PARTNER_COUNT = 48;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_AGE_DAYS = 3 * 365;
const MIN_AGE_DAYS = 14;

const REVENUE_RANGE: Record<PartnerTier, { min: number; max: number }> = {
  [PARTNER_TIER.GOLD]: { min: 750_000, max: 2_500_000 },
  [PARTNER_TIER.SILVER]: { min: 200_000, max: 750_000 },
  [PARTNER_TIER.BRONZE]: { min: 25_000, max: 200_000 }
};

const faker = createSeededFaker(PARTNER_SEED);

function generatePartner(): Partner {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const name = faker.company.name();
  const tier = faker.helpers.weightedArrayElement([
    { weight: 2, value: PARTNER_TIER.GOLD },
    { weight: 3, value: PARTNER_TIER.SILVER },
    { weight: 5, value: PARTNER_TIER.BRONZE }
  ]);
  const status = faker.helpers.weightedArrayElement([
    { weight: 7, value: PARTNER_STATUS.ACTIVE },
    { weight: 1.5, value: PARTNER_STATUS.PAUSED },
    { weight: 1.5, value: PARTNER_STATUS.PENDING }
  ]);
  const reference = getReferenceDate().getTime();

  return {
    id: `prt_${faker.string.alphanumeric({ length: 8, casing: 'lower' })}`,
    name,
    contactName: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    tier,
    status,
    country: faker.location.countryCode('alpha-2'),
    revenue: roundMoney(faker.number.float({ ...REVENUE_RANGE[tier], fractionDigits: 2 })),
    // Filled in by the payouts store from the generated payouts.
    payoutsTotal: 0,
    joinedAt: faker.date
      .between({
        from: reference - MAX_AGE_DAYS * DAY_MS,
        to: reference - MIN_AGE_DAYS * DAY_MS
      })
      .toISOString()
  };
}

// Mock partner data store
export const fakePartners = {
  records: [] as Partner[],

  initialize() {
    this.records = Array.from({ length: PARTNER_COUNT }, () => generatePartner());
  },

  findById(id: string) {
    return this.records.find((partner) => partner.id === id);
  },

  setPayoutsTotal(id: string, payoutsTotal: number) {
    const partner = this.findById(id);
    if (partner) partner.payoutsTotal = roundMoney(payoutsTotal);
  },

  getAll({
    statuses = [],
    tiers = [],
    search
  }: {
    statuses?: string[];
    tiers?: string[];
    search?: string;
  }) {
    let partners = [...this.records];

    if (statuses.length > 0) {
      partners = partners.filter((partner) => statuses.includes(partner.status));
    }

    if (tiers.length > 0) {
      partners = partners.filter((partner) => tiers.includes(partner.tier));
    }

    if (search) {
      partners = matchSorter(partners, search, {
        keys: ['name', 'contactName', 'email', 'id']
      });
    }

    return partners;
  },

  // Paginated results with status/tier filtering, search and sorting
  async getPartners({
    page = 1,
    limit = 10,
    status,
    tier,
    search,
    sort
  }: {
    page?: number;
    limit?: number;
    status?: string;
    tier?: string;
    search?: string;
    sort?: string;
  }) {
    await delay(MOCK_DELAY.LIST);

    const allPartners = sortRecords(
      this.getAll({ statuses: splitList(status), tiers: splitList(tier), search }),
      sort
    );
    const { offset, limit: pageLimit, items } = paginate(allPartners, page, limit);

    return {
      success: true,
      time: new Date().toISOString(),
      message: 'Sample data for testing and learning purposes',
      total_partners: allPartners.length,
      offset,
      limit: pageLimit,
      partners: items
    };
  },

  async getPartnerById(id: string) {
    await delay(MOCK_DELAY.DETAIL);

    const partner = this.findById(id);

    if (!partner) {
      return { success: false as const, message: `Partner with ID ${id} not found` };
    }

    return { success: true as const, partner };
  }
};

// Initialize sample partners
fakePartners.initialize();
