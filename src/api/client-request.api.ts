import instance from '@/lib/axios';
import { CLIENT_REQUESTS_API } from '@/config/api';
import { Request } from '@/features/proposals/types';

// List Client Requests (optionally with filters)
export const listClientRequests = async (params?: Record<string, any>) => {
  const response = await instance.get(CLIENT_REQUESTS_API, { params });
  return response.data;
};

// Get Client Request by ID
export const getClientRequestById = async (requestId: string) => {
  const response = await instance.get(`${CLIENT_REQUESTS_API}${requestId}`);
  return response.data;
}; 