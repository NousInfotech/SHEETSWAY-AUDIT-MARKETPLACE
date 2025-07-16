import instance from '@/lib/axios';
import {
  PlaidLinkTokenInput,
  PlaidExchangeTokenInput,
  CreatePlaidBankAccountInput,
} from '@/types/api-types/plaid.types';

const baseUrl = '/api/v1/plaid-integrations';

/**
 * 🔗 Create a link token for Plaid Link
 */
export const createLinkToken = async (data: PlaidLinkTokenInput): Promise<{ linkToken: string }> => {
  const response = await instance.post(`${baseUrl}/link-token`, data);
  return response.data;
};

/**
 * 🔄 Exchange a public token for access token/item
 */
export const exchangePublicToken = async (data: PlaidExchangeTokenInput): Promise<any> => {
  const response = await instance.post(`${baseUrl}/exchange-token`, data);
  return response.data;
};

/**
 * 🏦 Create a Plaid-linked bank account in your system
 */
export const createPlaidBankAccount = async (data: CreatePlaidBankAccountInput): Promise<any> => {
  const response = await instance.post(`${baseUrl}/create-account`, data);
  return response.data;
};
