import { SALTEDGE_API } from '@/config/api';
import instance from '@/lib/axios';

export const createSessionForSaltedge = async (returnTo: string) => {
  const response = await instance.post(`${SALTEDGE_API}/create-session`, {
    returnTo
  });
  return response.data;
};

// new for iniitial testing
export const createConnectSession = async (returnTo: string) => {
  const response = await instance.post(`${SALTEDGE_API}/create-session`, {
    returnTo
  });
  return response.data;
};

export const fetchConnections = async (customerId: string) => {
  const response = await instance.get(
    `${SALTEDGE_API}/connection/customer/${customerId}`
  );
  return response.data;
};

export const fetchAccounts = async (connectionId: string) => {
  const response = await instance.get(
    `${SALTEDGE_API}/accounts/${connectionId}`
  );
  return response.data;
};

export const fetchTransactions = async (accountId:string, connectionId: string) => {
  const response = await instance.get(
    `${SALTEDGE_API}/transactions/${accountId}?connectionId=${connectionId}`
  );
  return response.data;
};

export const checkConnectionStatus = async (connectionId: string) => {
  const response = await instance.get(
    `${SALTEDGE_API}/connection/${connectionId}/status`
  );
  return response.data;
};
