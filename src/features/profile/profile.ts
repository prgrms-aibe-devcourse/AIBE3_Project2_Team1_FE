import axiosInstance from '@/services/axios';

// ✅ 유저 조회 응답 DTO
export interface UserResponseDto {
  resultCode: string;
  msg: string;
  data: {
    name: string;
    nickname: string;
    phoneNumber: string;
    birth: string; // YYYY-MM-DD
    email: string;
    role: 'CLIENT' | 'FREELANCER';
    ProfileImgUrl: string | null;
  };
}

// ✅ 유저 수정 요청 DTO
export interface UserUpdateRequestDto {
  name?: string;
  nickname?: string;
  phoneNumber?: string;
  birth?: string;
}

// ✅ 프로필 조회 응답 DTO
export interface ProfileResponseDto {
  resultCode: string;
  msg: string;
  data: {
    profileId: number;
    title: string;
    description: string;
    skills: string;
    hourlyRate: number;
    visibility: 'PUBLIC' | 'PRIVATE';
  };
}

// ✅ 프로필 수정 응답 DTO
export interface ProfileUpdateResponseDto {
  resultCode: string;
  msg: string;
  data: {
    profileId: number;
    title: string;
    description: string;
    skills: string;
    hourlyRate: number;
    visibility: 'PUBLIC' | 'PRIVATE';
  };
}

// ✅ 유저 정보 조회 API
export const getMyUser = async (): Promise<UserResponseDto> => {
  const res = await axiosInstance.get('/users/info');
  return res.data as UserResponseDto;
};

// ✅ 유저 정보 수정 API
export const updateMyUser = async (data: UserUpdateRequestDto): Promise<UserResponseDto> => {
  const res = await axiosInstance.put('/users/info', data);
  return res.data as UserResponseDto;
};

// ✅ 프로필 정보 조회 API
export const getMyProfile = async (): Promise<ProfileResponseDto> => {
  const res = await axiosInstance.get('/profiles/me');
  return res.data as ProfileResponseDto;
};

// ✅ 프로필 정보 수정 API
export const updateMyProfile = async (
  data: Partial<ProfileResponseDto['data']>
): Promise<ProfileUpdateResponseDto> => {
  const res = await axiosInstance.put('/profiles/me', data);
  return res.data as ProfileUpdateResponseDto;
};
