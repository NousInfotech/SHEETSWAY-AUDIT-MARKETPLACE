import instance from '@/lib/axios';

export const getAuditorById = async (auditorId: string) => {
  const response = await instance.get(`/api/v1/auditors/${auditorId}`);
  return response.data;
};

export const getAuditFirmById = async (firmId: string) => {
  const response = await instance.get(`/api/v1/auditors/audit-firm/${firmId}`);
  return response.data;
}; 