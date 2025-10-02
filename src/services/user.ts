import type {
  UserDto,
  UserPasswordChangeRequestDto,
  UserRegisterRequestDto,
  UserUpdateRequestDto,
} from '@/features/user/user';
import axiosInstance from '@/services/axios';

export type User = {
  nickname?: string;
  [key: string]: unknown;
};

// 회원가입
export const signUp = async (data: UserRegisterRequestDto): Promise<UserDto> => {
  const res = await axiosInstance.post('/users/signup', data);
  return res.data;
};

// 내 정보 조회
export const getMyInfo = async (): Promise<UserDto> => {
  const res = await axiosInstance.get('/users/info');
  return res.data;
};

// 회원정보 수정
export const updateUser = async (data: UserUpdateRequestDto): Promise<UserDto> => {
  const res = await axiosInstance.put('/users/info', data);
  return res.data;
};

// 비밀번호 변경
export const changePassword = async (data: UserPasswordChangeRequestDto): Promise<void> => {
  await axiosInstance.patch('/users/info/password', data);
};

// 회원탈퇴
export const deleteUser = async (): Promise<void> => {
  await axiosInstance.delete('/users');
};
