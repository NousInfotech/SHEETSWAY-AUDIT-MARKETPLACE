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


export const getServicesbyUserId = async () => {
  const response = await instance.get(`${APIDECK_API}/services/list`);
  return response.data;
};




// export const getJournalEntries = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/journal-entries`);
//   // Typically: { data: { getJournalEntriesResponse: { data: [...] } } }
//   return response.data.getJournalEntriesResponse.data;
// };

// export const getLedgerAccountsData = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/ledger-accounts`);
//   // Typically: { data: { getLedgerAccountsResponse: { data: [...] } } }
//   return response.data.getLedgerAccountsResponse.data;
// };

// export const getProfitAndLoss = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/profit-and-loss`);
//   // For reports, it can sometimes be directly in `response.data.data` or
//   // { data: { getProfitAndLossResponse: { data: { ...reportObject } } } }
//   // Let's assume the unified pattern here for consistency if a wrapper exists.
//   // If it's a direct object, you might just return `response.data.getProfitAndLossResponse;`
//   // or `response.data` if no wrapper.
//   return response.data.getProfitAndLossResponse.data; // Common pattern for nested data
// };

// export const getBalanceSheet = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/balance-sheet`);
//   // Similar to Profit and Loss, verifying structure is key.
//   return response.data.getBalanceSheetResponse.data; // Common pattern for nested data
// };

// export const getAgedReceivables = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/aged-receivables`);
//   // Collection endpoint, likely follows the `response.data.[EndpointName]Response.data` pattern.
//   return response.data.getAgedReceivablesResponse.data;
// };

// export const getAgedPayables = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/aged-payables`);
//   // Collection endpoint, likely follows the `response.data.[EndpointName]Response.data` pattern.
//   return response.data.getAgedPayablesResponse.data;
// };

// export const getCustomers = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/customers`);
//   // Collection endpoint, likely follows the `response.data.[EndpointName]Response.data` pattern.
//   return response.data.getCustomersResponse.data;
// };

// export const getSuppliers = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/suppliers`);
//   // Collection endpoint, likely follows the `response.data.[EndpointName]Response.data` pattern.
//   return response.data.getSuppliersResponse.data;
// };

// export const getBillPayments = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/bill-payments`);
//   // Collection endpoint, likely follows the `response.data.[EndpointName]Response.data` pattern.
//   return response.data.getBillPaymentsResponse.data;
// };

// export const getBills = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/bills`);
//   // Collection endpoint, likely follows the `response.data.[EndpointName]Response.data` pattern.
//   return response.data.getBillsResponse.data;
// };

// export const getExpenses = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/expenses`);
//   // Collection endpoint, likely follows the `response.data.[EndpointName]Response.data` pattern.
//   return response.data.getExpensesResponse.data;
// };

// export const getPayments = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/payments`);
//   // Collection endpoint, likely follows the `response.data.[EndpointName]Response.data` pattern.
//   return response.data.getPaymentsResponse.data;
// };

// export const getBankFeed = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/bank-feed`);
//   // Collection endpoint, likely follows the `response.data.[EndpointName]Response.data` pattern.
//   return response.data.getBankFeedResponse.data;
// };

// export const getBankStatements = async (connectionId: string) => {
//   const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/bank-feed-statements`);
//   // Collection endpoint, likely follows the `response.data.[EndpointName]Response.data` pattern.
//   return response.data.getBankStatementsResponse.data;
// };





// Helper function to safely extract data from APIDECK responses
const extractAPIResponse = (response: any, endpointName: string) => {
  // Check multiple possible response structures
  if (response.data?.[`${endpointName}Response`]?.data) {
    return response.data[`${endpointName}Response`].data;
  }
  if (response.data?.data) {
    return response.data.data;
  }
  if (response.data) {
    return response.data;
  }
  
  console.warn(`Unexpected response structure for ${endpointName}:`, response);
  return response;
};

export const getJournalEntries = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/journal-entries`);
    return extractAPIResponse(response, 'getJournalEntries');
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }
};

export const getLedgerAccountsData = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/ledger-accounts`);
    return extractAPIResponse(response, 'getLedgerAccounts');
  } catch (error) {
    console.error('Error fetching ledger accounts:', error);
    throw error;
  }
};

export const getProfitAndLoss = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/profit-and-loss`);
    // P&L reports might have different structure - often direct data object
    if (response.data?.getProfitAndLossResponse) {
      return response.data.getProfitAndLossResponse.data || response.data.getProfitAndLossResponse;
    }
    return extractAPIResponse(response, 'getProfitAndLoss');
  } catch (error) {
    console.error('Error fetching profit and loss:', error);
    throw error;
  }
};

export const getBalanceSheet = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/balance-sheet`);
    // Balance sheet might have different structure - often direct data object
    if (response.data?.getBalanceSheetResponse) {
      return response.data.getBalanceSheetResponse.data || response.data.getBalanceSheetResponse;
    }
    return extractAPIResponse(response, 'getBalanceSheet');
  } catch (error) {
    console.error('Error fetching balance sheet:', error);
    throw error;
  }
};

export const getAgedReceivables = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/aged-receivables`);
    return extractAPIResponse(response, 'getAgedReceivables');
  } catch (error) {
    console.error('Error fetching aged receivables:', error);
    throw error;
  }
};

export const getAgedPayables = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/aged-payables`);
    return extractAPIResponse(response, 'getAgedPayables');
  } catch (error) {
    console.error('Error fetching aged payables:', error);
    throw error;
  }
};

export const getCustomers = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/customers`);
    return extractAPIResponse(response, 'getCustomers');
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const getSuppliers = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/suppliers`);
    return extractAPIResponse(response, 'getSuppliers');
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

export const getBillPayments = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/bill-payments`);
    return extractAPIResponse(response, 'getBillPayments');
  } catch (error) {
    console.error('Error fetching bill payments:', error);
    throw error;
  }
};

export const getBills = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/bills`);
    return extractAPIResponse(response, 'getBills');
  } catch (error) {
    console.error('Error fetching bills:', error);
    throw error;
  }
};

export const getExpenses = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/expenses`);
    return extractAPIResponse(response, 'getExpenses');
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const getPayments = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/payments`);
    return extractAPIResponse(response, 'getPayments');
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const getBankFeed = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/bank-feed`);
    return extractAPIResponse(response, 'getBankFeed');
  } catch (error) {
    console.error('Error fetching bank feed:', error);
    throw error;
  }
};

export const getBankStatements = async (connectionId: string) => {
  try {
    const response = await instance.get(`${APIDECK_API}/accounts/${connectionId}/bank-feed-statements`);
    return extractAPIResponse(response, 'getBankStatements');
  } catch (error) {
    console.error('Error fetching bank statements:', error);
    throw error;
  }
};

// Optional: Add a test function to verify response structures
export const testAPIResponseStructures = async (connectionId: string) => {
  const endpoints = [
    { name: 'Journal Entries', fn: getJournalEntries },
    { name: 'Ledger Accounts', fn: getLedgerAccountsData },
    { name: 'Profit & Loss', fn: getProfitAndLoss },
    { name: 'Balance Sheet', fn: getBalanceSheet },
    { name: 'Customers', fn: getCustomers },
    // Add more as needed
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const data = await endpoint.fn(connectionId);
      console.log(`${endpoint.name} structure:`, {
        isArray: Array.isArray(data),
        hasData: !!data,
        keys: typeof data === 'object' && data ? Object.keys(data) : 'Not an object',
        sampleLength: Array.isArray(data) ? data.length : 'Not an array'
      });
    } catch (error) {
      console.error(`${endpoint.name} failed:`, error);
    }
  }
};









