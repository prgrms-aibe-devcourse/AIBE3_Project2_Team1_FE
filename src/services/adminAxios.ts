import axios from 'axios';
import { getAdminAuthHeader } from './user';

const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 시 자동으로 Authorization 헤더 붙이기
adminAxios.interceptors.request.use((config) => {
  const header = getAdminAuthHeader();
  if (header) {
    config.headers.Authorization = header;
  }
  return config;
});

export default adminAxios;
