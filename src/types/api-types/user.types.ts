import {
  userSchema,
  updateUserSchema,
  userIdParamsSchema,
  userFiltersSchema,
  businessProfileSchema,
  updateBusinessProfileSchema,
  businessIdParamsSchema,
  businessProfileFiltersSchema,
  businessAttachmentSchema,
  attachmentIdParamsSchema,
  plaidAccountSchema,
  plaidAccountIdParamsSchema,
  accountingIntegrationSchema,
  integrationIdParamsSchema,
} from '@/validators/user.validator'; // adjust to your actual schema path

import { z } from 'zod';

// USER
export type CreateUserInput = z.infer<typeof userSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type UserFilters = z.infer<typeof userFiltersSchema>;

// BUSINESS PROFILE
export type CreateBusinessProfileInput = z.infer<typeof businessProfileSchema>;
export type UpdateBusinessProfileInput = z.infer<typeof updateBusinessProfileSchema>;
export type BusinessIdParams = z.infer<typeof businessIdParamsSchema>;
export type BusinessProfileFilters = z.infer<typeof businessProfileFiltersSchema>;

// ATTACHMENTS
export type BusinessAttachmentInput = z.infer<typeof businessAttachmentSchema>;
export type AttachmentIdParams = z.infer<typeof attachmentIdParamsSchema>;

// PLAID ACCOUNTS
export type PlaidAccountInput = z.infer<typeof plaidAccountSchema>;
export type PlaidAccountIdParams = z.infer<typeof plaidAccountIdParamsSchema>;

// ACCOUNTING INTEGRATIONS
export type AccountingIntegrationInput = z.infer<typeof accountingIntegrationSchema>;
export type IntegrationIdParams = z.infer<typeof integrationIdParamsSchema>;
