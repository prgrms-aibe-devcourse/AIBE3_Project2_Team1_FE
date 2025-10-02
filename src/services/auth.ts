import type { UserLoginResponseDto } from '@/features/auth/auth';
import { default as axios, default as axiosInstance } from './axios';

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<UserLoginResponseDto> => {
  const res = await axiosInstance.post('/auth/login/basic', credentials);
  return res.data as UserLoginResponseDto; // 타입 단언
};

// 로그아웃
export const logout = async () => {
  await axios.delete('/auth/logout');
};
