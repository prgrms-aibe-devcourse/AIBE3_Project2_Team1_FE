import axiosInstance from '@/services/axios';
import type { User } from '@/services/user';
import type { Dispatch, SetStateAction } from 'react';
import { createContext, useContext } from 'react';
export interface UserLoginResponseDto {
  resultCode: string;
  msg: string;
  data: {
    item: {
      id: number;
      nickname: string;
      [key: string]: unknown;
    };
    apiKey: string;
    accessToken: string;
  };
}

export interface UserInfoResponseDto {
  resultCode: string;
  msg: string;
  data: {
    id: number;
    createDate: string | null;
    modifyDate: string | null;
    nickname: string;
  };
}

export interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
}

export const defaultAuthContext: AuthContextType = {
  user: null,
  setUser: () => {},
  loading: false,
};

// 이메일 로그인
export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<UserLoginResponseDto> => {
  const res = await axiosInstance.post('/auth/login/basic', credentials);
  return res.data as UserLoginResponseDto;
};

// 현재 로그인한 사용자 정보 조회
export const getCurrentUser = async (): Promise<UserInfoResponseDto> => {
  const res = await axiosInstance.get('/users/info');
  return res.data as UserInfoResponseDto;
};

// 로그아웃
export const logout = async (): Promise<void> => {
  await axiosInstance.delete('/auth/logout');
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = (): AuthContextType => useContext(AuthContext);
