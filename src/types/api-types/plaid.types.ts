// types/plaid.types.ts
import { z } from 'zod';
import {
  plaidLinkTokenSchema,
  plaidExchangeTokenSchema,
  plaidAccountSchema,
} from '@/validators/plaid.validator'; // adjust path as needed

export type PlaidLinkTokenInput = z.infer<typeof plaidLinkTokenSchema>;

export type PlaidExchangeTokenInput = z.infer<typeof plaidExchangeTokenSchema>;

export type CreatePlaidBankAccountInput = z.infer<typeof plaidAccountSchema>;
