import { businessProfileSchema, plaidIntegrationSchema, CountryEnum, FirmSizeEnum } from './zod-schemas';
import { faker } from '@faker-js/faker';

export function generateMockBusinessProfile() {
  return businessProfileSchema.parse({
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.company.name(),
    vatId: faker.string.alphanumeric(10),
    country: CountryEnum.options[Math.floor(Math.random() * CountryEnum.options.length)],
    category: faker.company.buzzNoun(),
    size: FirmSizeEnum.options[Math.floor(Math.random() * FirmSizeEnum.options.length)],
    annualTurnover: faker.number.float({ min: 10000, max: 1000000 }),
    transactionsPerYear: faker.number.int({ min: 10, max: 1000 }),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  });
}

export function generateMockPlaidIntegration() {
  // Generate a random account number and take the last 4 digits
  const accountNumber = faker.finance.accountNumber();
  const last4 = accountNumber.slice(-4);
  return plaidIntegrationSchema.parse({
    id: faker.string.uuid(),
    institution: faker.company.name(),
    last4,
    accountType: faker.helpers.arrayElement(['checking', 'savings', 'business']),
    accountName: faker.finance.accountName(),
    createdAt: faker.date.past().toISOString(),
  });
}

export const mockBusinessProfiles = Array.from({ length: 3 }, generateMockBusinessProfile);
export const mockPlaidIntegrations = Array.from({ length: 2 }, generateMockPlaidIntegration); 