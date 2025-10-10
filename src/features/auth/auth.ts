import axiosInstance from '@/services/axios';

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

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<UserLoginResponseDto> => {
  const res = await axiosInstance.post('/auth/login/basic', credentials);
  return res.data as UserLoginResponseDto;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.delete('/auth/logout');
};
