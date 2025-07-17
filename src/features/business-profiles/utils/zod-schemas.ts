import { z } from 'zod';

export const CountryEnum = z.enum([
  'GERMANY',
  'FRANCE',
  'MALTA',
  'UAE',
  'INDIA',
  'UK',
  'USA',
  'NETHERLANDS',
  'IRELAND',
  'OTHER',
]);

export const FirmSizeEnum = z.enum([
  'SOLO',
  'SMALL',
  'MEDIUM',
  'LARGE',
]);

export const businessProfileSchema = z.object({
  id: z.string().uuid().optional(), // optional for creation
  userId: z.string().uuid(), // required for backend
  name: z.string().min(1, 'Business name is required'),
  vatId: z.string().optional(),
  country: CountryEnum,
  category: z.string().optional(),
  size: FirmSizeEnum.optional(),
  annualTurnover: z
    .number()
    .min(0, 'Annual Turnover must be at least 0')
    .max(999999999, 'Annual Turnover is too large')
    .optional(),
  transactionsPerYear: z
    .number()
    .min(0, 'Transactions Per Year must be at least 0')
    .max(999999999, 'Transactions Per Year is too large')
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const plaidIntegrationSchema = z.object({
  id: z.string().uuid(),
  institution: z.string(),
  last4: z.string(),
  accountType: z.string(),
  accountName: z.string(),
  createdAt: z.string(),
}); 

// Apideck accounting integration schema
export const apideckIntegrationSchema = z.object({
  id: z.string(),
  service: z.string(),
  status: z.string(),
  enabled: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
}); 