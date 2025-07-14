import { z } from 'zod';

export const plaidLinkTokenSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
});

export const plaidExchangeTokenSchema = z.object({
  publicToken: z.string().min(1, "Public token is required"),
  institution: z.string().optional(),
  last4: z.string().optional(),
  accountType: z.string().optional(),
  accountName: z.string().optional(),
});

export const plaidAccountSchema = z.object({
  publicToken: z.string().min(1, "Public token is required"),
  institution: z.string().min(1, "Institution name is required"),
  last4: z.string().min(4, "Last 4 digits are required").max(4, "Last 4 digits are required"),
  accountType: z.string().min(1, "Account type is required"),
  accountName: z.string().min(1, "Account name is required"),
}); 