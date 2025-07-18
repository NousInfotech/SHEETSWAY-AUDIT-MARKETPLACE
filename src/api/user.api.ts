import instance from '@/lib/axios';
import {
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
  CreateBusinessProfileInput,
  UpdateBusinessProfileInput,
  BusinessProfileFilters,
  BusinessAttachmentInput,
  PlaidAccountInput,
  AccountingIntegrationInput,
} from '@/types/api-types/user.types';

const baseUrl = 'api/v1/users';

// -----------------------------------------------------------------------------
// 🔓 PUBLIC ROUTES
// -----------------------------------------------------------------------------

export const registerUser = async (data: CreateUserInput) => {
  const response = await instance.post(`${baseUrl}/`, data);
  return response.data;
};

// -----------------------------------------------------------------------------
// 🔐 USER PROFILE (AUTH REQUIRED)
// -----------------------------------------------------------------------------

export const getProfile = async () => {
  const response = await instance.get(`${baseUrl}/profile`);
  return response.data;
};

export const updateUser = async (updateData: UpdateUserInput) => {
  const response = await instance.put(`${baseUrl}/profile`, updateData);
  return response.data;
};

export const deleteUser = async () => {
  const response = await instance.delete(`${baseUrl}/profile`);
  return response.data;
};

// -----------------------------------------------------------------------------
// 📄 BUSINESS PROFILES
// -----------------------------------------------------------------------------

export const getBusinessProfiles = async (filters?: BusinessProfileFilters) => {
  const response = await instance.get(`${baseUrl}/business-profiles`, {
    params: filters,
  });
  return response.data;
};

export const getBusinessProfile = async (businessId: string) => {
  const response = await instance.get(`${baseUrl}/business-profiles/${businessId}`);
  return response.data;
};

export const createBusinessProfile = async (data: CreateBusinessProfileInput) => {
  const response = await instance.post(`${baseUrl}/business-profiles`, data);
  return response.data;
};

export const updateBusinessProfile = async (
  businessId: string,
  data: UpdateBusinessProfileInput
) => {
  const response = await instance.put(`${baseUrl}/business-profiles/${businessId}`, data);
  return response.data;
};

export const deleteBusinessProfile = async (businessId: string) => {
  const response = await instance.delete(`${baseUrl}/business-profiles/${businessId}`);
  return response.data;
};

// -----------------------------------------------------------------------------
// 📎 BUSINESS ATTACHMENTS
// -----------------------------------------------------------------------------

export const getBusinessAttachments = async () => {
  const response = await instance.get(`${baseUrl}/business-attachments`);
  return response.data;
};

export const getBusinessAttachment = async (attachmentId: string) => {
  const response = await instance.get(`${baseUrl}/business-attachments/${attachmentId}`);
  return response.data;
};

export const createBusinessAttachment = async (
  businessId: string,
  attachmentData: BusinessAttachmentInput
) => {
  const formData = new FormData();
  formData.append('fileName', attachmentData.fileName);
  formData.append('fileUrl', attachmentData.fileUrl); // Or append file blob if uploading

  const response = await instance.post(
    `${baseUrl}/business-profiles/${businessId}/attachments`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const deleteBusinessAttachment = async (attachmentId: string) => {
  const response = await instance.delete(`${baseUrl}/business-attachments/${attachmentId}`);
  return response.data;
};

// -----------------------------------------------------------------------------
// 💳 PLAID BANK ACCOUNTS
// -----------------------------------------------------------------------------

export const getPlaidBankAccounts = async (filters?: any) => {
  const response = await instance.get(`${baseUrl}/plaid-accounts`, {
    params: filters
  });
  return response.data;
};

export const getPlaidBankAccount = async (plaidAccountId: string) => {
  const response = await instance.get(`${baseUrl}/plaid-accounts/${plaidAccountId}`);
  return response.data;
};

export const createPlaidBankAccount = async (data: PlaidAccountInput) => {
  const response = await instance.post(`${baseUrl}/plaid-accounts`, data);
  return response.data;
};

export const deletePlaidBankAccount = async (plaidAccountId: string) => {
  const response = await instance.delete(`${baseUrl}/plaid-accounts/${plaidAccountId}`);
  return response.data;
};

// -----------------------------------------------------------------------------
// 📊 ACCOUNTING INTEGRATIONS
// -----------------------------------------------------------------------------

export const getAccountingIntegrations = async (filters?: any) => {
  const response = await instance.get(`${baseUrl}/accounting-integrations`, {
    params: filters
  });
  return response.data;
};

export const getAccountingIntegration = async (integrationId: string) => {
  const response = await instance.get(`${baseUrl}/accounting-integrations/${integrationId}`);
  return response.data;
};

export const createAccountingIntegration = async (data: AccountingIntegrationInput) => {
  const response = await instance.post(`${baseUrl}/accounting-integrations`, data);
  return response.data;
};

export const deleteAccountingIntegration = async (integrationId: string) => {
  const response = await instance.delete(`${baseUrl}/accounting-integrations/${integrationId}`);
  return response.data;
};
