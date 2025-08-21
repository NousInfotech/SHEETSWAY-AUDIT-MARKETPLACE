import { SALTEDGE_API } from "@/config/api";
import instance from "@/lib/axios";



export const createSessionForSaltedge = async (params?: Record<string, any>) => {
  const response = await instance.post(`${SALTEDGE_API}/create-session`, { params });
  console.log(response.data)
  return response.data;
};