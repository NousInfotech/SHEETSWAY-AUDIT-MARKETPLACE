import { SALTEDGE_API } from '@/config/api';
import instance from '@/lib/axios';

export const createSessionForSaltedge = async (returnTo: string) => {
  const response = await instance.post(`${SALTEDGE_API}/create-session`, {
    returnTo
  });
  console.log(response.data);
  return response.data;
};

// new for iniitial testing
export const createConnectSession = async (returnTo: string) => {
  const response = await instance.post(`${SALTEDGE_API}/create-session`, {
    returnTo
  });
  console.log(response.data);
  return response.data;
};
export const fetchAccounts = async (connectionId: string) => {
  const response = await instance.get(
    `${SALTEDGE_API}//accounts/${connectionId}`
  );
  console.log(response.data);
  return response.data;
};
export const fetchTransactions = async (connectionId: string) => {
  const response = await instance.get(
    `${SALTEDGE_API}/transactions/${connectionId}`
  );
  console.log(response.data);
  return response.data;
};
export const checkConnectionStatus = async (connectionId: string) => {
  const response = await instance.get(
    `${SALTEDGE_API}/connection/${connectionId}/status`
  );
  console.log(response.data);
  return response.data;
};
