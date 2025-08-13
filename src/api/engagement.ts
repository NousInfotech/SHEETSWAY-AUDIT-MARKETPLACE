import { CLIENT_ENGAGEMENT_API, ENGAGEMENT_API, ENGAGEMENT_BY_ID_API } from "@/config/api";
import instance from "@/lib/axios";

// List Engagements 
export const listEngagements = async (params?: Record<string, any>) => {
  const response = await instance.get(ENGAGEMENT_API, { params });
  return response.data;
};


export const createPayment = async (params?: Record<string, any>) => {
  const response = await instance.post(`${ENGAGEMENT_API}/98ed7140-5a0a-470f-9cf5-251a61bd6fec/pre-engagement-payment/create`, { params });
  return response.data;
};

export const listClientEngagements = async (params?: Record<string, any>) => {
  const response = await instance.get(CLIENT_ENGAGEMENT_API, { params });
  return response.data;
};



// Get Engagement by ID
export const getEngagementById = async (engagementId: string) => {
  const response = await instance.get(ENGAGEMENT_BY_ID_API(engagementId));
  return response.data;
};

