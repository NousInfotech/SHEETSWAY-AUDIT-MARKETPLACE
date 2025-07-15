import { CountryEnum, FirmSizeEnum } from '@/features/business-profiles/utils/zod-schemas';
import { Country, FirmSize } from '@/types/api-types/enums';
import { z } from 'zod';


// =============================================================================
// USER SCHEMAS
// =============================================================================

export const userSchema = z.object({
  firebaseId: z.string(),
  email: z.string().email("email is required"),
  name: z.string().min(1, "name is required"),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
});

export const userIdParamsSchema = z.object({
  userId: z.string().uuid(),
});

// =============================================================================
// BUSINESS PROFILE SCHEMAS
// =============================================================================

export const businessProfileSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  vatId: z.string().optional(),
  country: z.nativeEnum(Country, {
    errorMap: () => ({ message: "Invalid country" })
  }),
  category: z.string().optional(),
  size: z.nativeEnum(FirmSize, {
    errorMap: () => ({ message: "Invalid firm size" })
  }).optional(),
  annualTurnover: z.number().min(0, "Annual turnover must be 0 or greater").optional(),
  transactionsPerYear: z.number().min(0, "Transactions per year must be 0 or greater").optional(),
});

export const updateBusinessProfileSchema = z.object({
  name: z.string().min(1, "Business name is required").optional(),
  vatId: z.string().optional(),
  country: z.nativeEnum(Country, {
    errorMap: () => ({ message: "Invalid country" })
  }).optional(),
  category: z.string().optional(),
  size: z.nativeEnum(FirmSize, {
    errorMap: () => ({ message: "Invalid firm size" })
  }).optional(),
  annualTurnover: z.number().min(0, "Annual turnover must be 0 or greater").optional(),
  transactionsPerYear: z.number().min(0, "Transactions per year must be 0 or greater").optional(),
});

export const businessIdParamsSchema = z.object({
  businessId: z.string().uuid("Invalid business ID format"),
});

// =============================================================================
// BUSINESS ATTACHMENT SCHEMAS
// =============================================================================

export const businessAttachmentSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileUrl: z.string().url("Valid file URL is required"),
});

export const attachmentIdParamsSchema = z.object({
  attachmentId: z.string().uuid("Invalid attachment ID format"),
});

// =============================================================================
// PLAID ACCOUNT SCHEMAS
// =============================================================================

export const plaidAccountSchema = z.object({
  accessToken: z.string().min(1, "Access token is required"),
  itemId: z.string().min(1, "Item ID is required"),
  institution: z.string().min(1, "Institution name is required"),
  last4: z.string().length(4, "Last 4 digits must be exactly 4 characters"),
  accountType: z.string().min(1, "Account type is required"),
  accountName: z.string().min(1, "Account name is required"),
});

export const plaidAccountIdParamsSchema = z.object({
  plaidAccountId: z.string().uuid("Invalid Plaid account ID format"),
});

// =============================================================================
// ACCOUNTING INTEGRATION SCHEMAS
// =============================================================================

export const accountingIntegrationSchema = z.object({
  provider: z.string().min(1, "Provider is required"),
  unifiedApi: z.string().min(1, "Unified API is required"),
  integrationId: z.string().min(1, "Integration ID is required"),
  accessToken: z.string().min(1, "Access token is required"),
});

export const integrationIdParamsSchema = z.object({
  integrationId: z.string().uuid("Invalid integration ID format"),
});

// =============================================================================
// QUERY FILTER SCHEMAS
// =============================================================================

export const userFiltersSchema = z.object({
  search: z.string().optional(),
  email: z.string().email().optional(),
  limit: z.number().min(1).max(100).optional(),
  page: z.number().min(1).optional(),
});

export const businessProfileFiltersSchema = z.object({
  userId:z.string().optional(),
  country: z.nativeEnum(Country).optional(),
  category: z.string().optional(),
  size: z.nativeEnum(FirmSize).optional(),
  limit: z.number().min(1).max(100).optional(),
  page: z.number().min(1).optional(),
});
