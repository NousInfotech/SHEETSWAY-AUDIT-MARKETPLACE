// lib/axios.ts
import axios from 'axios';
import { getToken } from './utils';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Request interceptor: Add auth and role headers
instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers['active-role'] = 'USER';

  return config;
});

// Response interceptor: Return only data if success === true
instance.interceptors.response.use(
  (response) => {
    const data = response.data;

    if (data?.success === true) {
      return data; // ✅ return actual payload
    } else {
      const error = data?.message || 'Unknown API response error';
      return Promise.reject(new Error(error));
    }
  },
  (error) => {
    return Promise.reject(error); // Network/server error
  }
);

export default instance;
