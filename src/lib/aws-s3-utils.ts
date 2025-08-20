import axios from 'axios';
import axiosInstance from './axios'; 


// uploadSingleFile with Axios

export async function uploadSingleFile(
  file: File,
  folderName: string
): Promise<{ fileKey: string; fileUrl: string }> {
  // 1. Get a pre-signed URL from your server
  const { data } = await axiosInstance.post('/api/v1/upload/single', {
    fileName: file.name,
    contentType: file.type,
    folder: folderName,
  });

  const { uploadUrl, fileKey, fileUrl } = data;

  // 2. Upload the file to the pre-signed URL
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });

  return { fileKey, fileUrl };
}





// uploadMultipleFiles with Axios


export async function uploadMultipleFiles(
  files: File[],
  folderName: string
): Promise<{ fileKey: string; fileUrl: string }[]> {
  // 1. Get pre-signed URLs for all files
  const payload = files.map((file) => ({
    fileName: file.name,
    contentType: file.type,
    folder: folderName,
  }));

  const { data: signedResponses } = await axiosInstance.post<{
    uploadUrl: string;
    fileKey: string;
    fileUrl: string;
  }[]>('/api/v1/upload/multiple', { files: payload });

  // 2. Upload each file to its corresponding pre-signed URL in parallel
  await Promise.all(
    files.map((file, i) => {
      const { uploadUrl } = signedResponses[i];
      return axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
      });
    })
  );

  return signedResponses.map(({ fileKey, fileUrl }) => ({ fileKey, fileUrl }));
}





// getAccessUrlForFile with Axios


export async function getAccessUrlForFile(fileKey: string): Promise<string> {
  const response = await axiosInstance.post('/api/v1/upload/single/access', {
    fileKey,
  });
  return response.data;
}



// getAccessUrlsForFiles with Axios

export async function getAccessUrlsForFiles(fileKeys: string[]): Promise<string[]> {
  const response = await axiosInstance.post('/api/v1/upload/multiple/access', {
    fileKeys,
  });
  return response.data;
}