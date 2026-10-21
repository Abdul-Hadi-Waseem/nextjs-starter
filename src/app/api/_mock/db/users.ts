////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { delay, paginate, parseSort, sortRecords, splitList } from '@/app/api/_mock/db/utils';
import type { User } from '@/features/examples/tables/users/api/types';
import { matchSorter } from 'match-sorter';

function generateRandomUserData(id: number): User {
  const roles = ['Developer', 'Designer', 'Manager', 'QA', 'DevOps', 'Product Owner'];
  const statuses = ['Active', 'Inactive', 'Invited'];

  return {
    id,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: 'national' }),
    status: faker.helpers.arrayElement(statuses),
    role: faker.helpers.arrayElement(roles),
    created_at: faker.date.between({ from: '2022-01-01', to: '2023-12-31' }).toISOString(),
    updated_at: faker.date.recent().toISOString()
  };
}

// The table's "name" column is computed from first + last name, so sort a copy that carries it.
const NAME_SORT_ID = 'name';

function sortUsers(users: User[], sort?: string) {
  const [first] = parseSort(sort);
  if (first?.id !== NAME_SORT_ID) return sortRecords(users, sort);
  const named = users.map((user) => ({ user, name: `${user.first_name} ${user.last_name}` }));
  return sortRecords(named, sort).map(({ user }) => user);
}

// Mock user data store
export const fakeUsers = {
  records: [] as User[],

  initialize() {
    const sampleUsers: User[] = [];
    for (let i = 1; i <= 50; i++) {
      sampleUsers.push(generateRandomUserData(i));
    }

    this.records = sampleUsers;
  },

  async getAll({ roles = [], search }: { roles?: string[]; search?: string }) {
    let users = [...this.records];

    if (roles.length > 0) {
      users = users.filter((user) => roles.includes(user.role));
    }

    if (search) {
      users = matchSorter(users, search, {
        keys: ['first_name', 'last_name', 'email']
      });
    }

    return users;
  },

  async createUser(data: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    await delay(800);

    const newUser: User = {
      ...data,
      id: this.records.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.records.push(newUser);

    return {
      success: true,
      message: 'User created successfully',
      user: newUser
    };
  },

  async updateUser(id: number, data: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    await delay(800);

    const index = this.records.findIndex((user) => user.id === id);

    if (index === -1) {
      return { success: false, message: `User with ID ${id} not found` };
    }

    this.records[index] = {
      ...this.records[index],
      ...data,
      updated_at: new Date().toISOString()
    };

    return {
      success: true,
      message: 'User updated successfully',
      user: this.records[index]
    };
  },

  async deleteUser(id: number) {
    await delay(800);

    const index = this.records.findIndex((user) => user.id === id);

    if (index === -1) {
      return { success: false, message: `User with ID ${id} not found` };
    }

    this.records.splice(index, 1);

    return {
      success: true,
      message: 'User deleted successfully'
    };
  },

  async getUsers({
    page = 1,
    limit = 10,
    roles,
    search,
    sort
  }: {
    page?: number;
    limit?: number;
    roles?: string | string[];
    search?: string;
    sort?: string;
  }) {
    await delay(800);
    const allUsers = sortUsers(await this.getAll({ roles: splitList(roles), search }), sort);
    const { offset, limit: pageLimit, items } = paginate(allUsers, page, limit);

    return {
      success: true,
      time: new Date().toISOString(),
      message: 'Sample data for testing and learning purposes',
      total_users: allUsers.length,
      offset,
      limit: pageLimit,
      users: items
    };
  }
};

fakeUsers.initialize();
