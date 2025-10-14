import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - accessToken 자동 주입
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// refreshToken 쿠키 기반 accessToken 재발급
const reissueAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL ?? '/api/v1'}/auth/reissue`,
      {},
      { withCredentials: true }
    );

    const newAccessToken = response.data?.data?.accessToken;
    if (newAccessToken) {
      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    }

    return null;
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    return null;
  }
};

// 응답 인터셉터 - 401 발생 시 재발급 및 재요청
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    if (!originalRequest || window.location.pathname === '/login') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await reissueAccessToken();

      if (newAccessToken) {
        (originalRequest.headers as Record<string, string>).Authorization =
          `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        if (window.location.pathname !== '/login') {
          window.location.replace('/login');
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
