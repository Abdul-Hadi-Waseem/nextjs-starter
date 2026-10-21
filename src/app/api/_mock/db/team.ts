////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { MOCK_DELAY, createSeededFaker, delay, getReferenceDate } from '@/app/api/_mock/db/utils';
import { DEMO_ADMIN, ROLE } from '@/features/auth/constants/auth';
import type { TeamMember } from '@/features/settings/api/types';

const TEAM_SEED = 2604;
const TEAM_SIZE = 6;
const ADMIN_COUNT = 2;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_AGE_DAYS = 2 * 365;
const EMAIL_DOMAIN = 'example.com';

const faker = createSeededFaker(TEAM_SEED);

function generateMember(index: number): TeamMember {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const reference = getReferenceDate().getTime();
  // The first member is the demo admin, so the signed-in demo user shows up in the list.
  const email =
    index === 0
      ? DEMO_ADMIN.email
      : faker.internet.email({ firstName, lastName, provider: EMAIL_DOMAIN }).toLowerCase();

  return {
    id: `usr_${faker.string.alphanumeric({ length: 8, casing: 'lower' })}`,
    name: index === 0 ? 'Demo User' : `${firstName} ${lastName}`,
    email,
    role: index < ADMIN_COUNT ? ROLE.ADMIN : ROLE.MEMBER,
    joinedAt: faker.date
      .between({ from: reference - MAX_AGE_DAYS * DAY_MS, to: reference })
      .toISOString()
  };
}

// Mock team data store
export const fakeTeam = {
  records: [] as TeamMember[],

  initialize() {
    this.records = Array.from({ length: TEAM_SIZE }, (_, index) => generateMember(index));
  },

  async getMembers() {
    await delay(MOCK_DELAY.LIST);
    return { success: true, members: [...this.records] };
  }
};

fakeTeam.initialize();
