import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 예: http://localhost:8080/api/v1
  withCredentials: true, // 쿠키 기반 인증 시 필요
});

// 모든 요청에 Authorization 헤더 자동 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
