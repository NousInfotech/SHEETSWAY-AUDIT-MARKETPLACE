import { PAYMENT_API } from '@/config/api';
import instance from '@/lib/axios';

export const listPayments = async (params?: Record<string, any>) => {
  const response = await instance.get(PAYMENT_API, { params });
  return response.data;
};

export const listClientPayments = async (role:string, roleId:string) => {
  const response = await instance.get(`${PAYMENT_API}/by-role/filter?role=${role}&roleId=${roleId}`);
  return response.data;
};
