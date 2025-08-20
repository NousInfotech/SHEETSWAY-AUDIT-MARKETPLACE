import {
  CLIENT_ENGAGEMENT_API,
  ENGAGEMENT_API,
  ENGAGEMENT_BY_ID_API
} from '@/config/api';
import instance from '@/lib/axios';
import { toast } from 'sonner';

// List Engagements
export const listEngagements = async (params?: Record<string, any>) => {
  const response = await instance.get(ENGAGEMENT_API, { params });
  return response.data;
};

// Get Engagement by ID
export const getEngagementById = async (engagementId: string) => {
  const response = await instance.get(ENGAGEMENT_BY_ID_API(engagementId));
  return response.data;
};

export const listClientEngagements = async (params?: Record<string, any>) => {
  const response = await instance.get(CLIENT_ENGAGEMENT_API, { params });
  return response.data;
};

export const makeEngaementToStart = async (engagementId: string) => {
  try {
    const response = await instance.patch(
      `${ENGAGEMENT_API}/${engagementId}/start`
    );

    return response.data;
  } catch (error) {
    console.log(error);
    toast.error('you are unable to start the engagement ');
  }
};

export const createPayment = async (
  engagementId?: string,
  params?: Record<string, any>
) => {
  const response = await instance.post(
    `${ENGAGEMENT_API}/${engagementId}/pre-engagement-payment/create`,
    { params }
  );
  return response.data;
};





// Payments&Escrow

export const getEscrowbyEngagementId = async (params?: Record<string, any>) => {
  const response = await instance.get(`${ENGAGEMENT_API}/escrows`, { params });
  return response.data;
};

export const getPaymentEscrow = async (params?: Record<string, any>) => {
  const response = await instance.get(`${ENGAGEMENT_API}/escrow/payments`, {params});
  return response.data;
};


// milestones

export const listMilestones = async (params?: Record<string, any>) => {
  const response = await instance.get(`${ENGAGEMENT_API}/milestones`, { params });
  return response.data;
};
export const createMilestone = async (payload:any) => {
  const response = await instance.post(`${ENGAGEMENT_API}/milestone`, payload);
  return response.data;
};












// documements, files, folders

export const getRoots = async (engagementId: string) => {
  const response = await instance.get(`${ENGAGEMENT_API}/document-roots?engagementId=${engagementId}`);
  return response.data;
};

export const getRootFolders = async (rootId: string) => {
  const response = await instance.get(`${ENGAGEMENT_API}/document-folders?rootId=${rootId}`);
  return response.data;

};
export const getSubFolders = async (parentId: string) => {
  const response = await instance.get(`${ENGAGEMENT_API}/document-folders?parentId=${parentId}`);
  return response.data;
};
export const getFiles = async (folderId: string) => {
  const response = await instance.get(`${ENGAGEMENT_API}/document-files?folderId=${folderId}`);
  if(response.data){
    console.log("successfully got all files:", response.data)
  }
  return response.data;
};



export const createRootFolder = async (payload:any) => {
  const response = await instance.post(`${ENGAGEMENT_API}/document-folder`, payload);
  return response.data;
};

export const createSubFolder = async (payload:any) => {
  const response = await instance.post(`${ENGAGEMENT_API}/document-folder`, payload);
  return response.data;
};

export const createFile = async (payload:any ) => {
  
  console.log(payload)
  const response = await instance.post(`${ENGAGEMENT_API}/document-file`, payload );
  if(response.data){
    console.log("success:", response.data)
  }
  return response.data;
};


export const renameRootFolder = async (id: string, {name}:Record<string, any>) => {
  const response = await instance.put(`${ENGAGEMENT_API}/document-folder/${id}`);
  return response.data;
};

export const renameSubFolder = async (id: string, {name}:Record<string, any>) => {
  const response = await instance.put(`${ENGAGEMENT_API}/document-folder/${id}`);
  return response.data;
};

export const renameFile = async (id: string, {name}:Record<string, any>) => {
  const response = await instance.put(`${ENGAGEMENT_API}/document-file/${id}`);
  return response.data;
};



export const deleteRootFolder = async (id: string) => {
  const response = await instance.delete(`${ENGAGEMENT_API}/document-folder/${id}`);
  return response.data;
};

export const deleteSubFolder = async (id: string) => {
  const response = await instance.delete(`${ENGAGEMENT_API}/document-folder/${id}`);
  return response.data;
};

export const deleteFile = async (id: string) => {
  const response = await instance.delete(`${ENGAGEMENT_API}/document-file/${id}`);
  return response.data;
};


