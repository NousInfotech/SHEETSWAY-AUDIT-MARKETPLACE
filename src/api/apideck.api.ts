import instance from '@/lib/axios';
import { APIDECK_LINK_TOKEN_API, APIDECK_ACCOUNTING_INTEGRATIONS_API } from '@/config/api';

/**
 * 🔗 Create a link token for Apideck Vault
 */
export const createApideckLinkToken = async (): Promise<string> => {
  const response = await instance.post(APIDECK_LINK_TOKEN_API);
  // Defensive logging
  console.log("[createApideckLinkToken] Raw response:", response);
  if (
    response &&
    response.data &&
    typeof response.data.linkToken === "string"
  ) {
    return response.data.linkToken;
  }
  throw new Error(
    "[createApideckLinkToken] Unexpected response shape: " +
      JSON.stringify(response)
  );
};

/**
 * 💾 Save accounting integration after successful connection
 */
export interface AccountingIntegrationInput {
  userId: string;
  connectionId: string;
  consumerId:string;
  serviceId: string;
  unifiedApi: string;
  status: string;
  label: string;
}

export const saveAccountingIntegration = async (data: AccountingIntegrationInput): Promise<any> => {
  const response = await instance.post(APIDECK_ACCOUNTING_INTEGRATIONS_API, data);
  return response.data;
};

/**
 * 📊 Get accounting integrations for a user
 */
export const getAccountingIntegrations = async (): Promise<any> => {
  const response = await instance.get(APIDECK_ACCOUNTING_INTEGRATIONS_API);
  return response.data;
}; 