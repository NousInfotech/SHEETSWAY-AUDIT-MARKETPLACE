import instance from '@/lib/axios';
import {
  APIDECK_LINK_TOKEN_API,
  APIDECK_ACCOUNTING_INTEGRATIONS_API,
  APIDECK_API
} from '@/config/api';

/**
 * 🔗 Create a link token for Apideck Vault
 */

export const createApideckLinkToken = async (): Promise<string> => {
  const response = await instance.post(`${APIDECK_API}/link-token`);
  // Defensive logging
  console.log('[createApideckLinkToken] Raw response:', response);
  if (
    response &&
    response.data &&
    typeof response.data.linkToken === 'string'
  ) {
    return response.data.linkToken;
  }
  throw new Error(
    '[createApideckLinkToken] Unexpected response shape: ' +
      JSON.stringify(response)
  );
};


/**
 * 💾 Save accounting integration after successful connection
 */
export interface AccountingIntegrationInput {
  userId: string;
  connectionId: string;
  
  serviceId: string;
  unifiedApi: string;
  status: string;
  label: string;
}

export const saveAccountingIntegration = async (
  data: AccountingIntegrationInput
): Promise<any> => {
  const response = await instance.post(
    APIDECK_ACCOUNTING_INTEGRATIONS_API,
    data
  );
  return response.data;
};

/**
 * 📊 Get accounting integrations for a user
 */
export const getAccountingIntegrations = async (): Promise<any> => {
  const response = await instance.get(APIDECK_ACCOUNTING_INTEGRATIONS_API);
  return response.data;
};


export const getJournalEntries = async (connectionId:string) => {
  const response = await instance.get(`${APIDECK_API}/accounts/freshbooks/journal-entries`);
  return response.data;
};


export const getLedgerAccountsData = async (connectionId:string) => {
  const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/ledger-accounts`);
  return response.data;
};


export const getProfitAndLoss = async (connectionId:string) => {
  const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/profit-and-loss`);
  return response.data;
};

export const getBalanceSheet = async (connectionId:string) => {
  const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/balance-sheet`);
  return response.data;
};

export const getAgedReceivables = async (connectionId:string) => {
  const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/aged-receivables`);
  return response.data;
};

export const getAgedPayables = async (connectionId:string) => {
  const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/aged-payables`);
  return response.data;
};










