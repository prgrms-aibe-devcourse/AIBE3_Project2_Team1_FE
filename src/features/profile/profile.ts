import axiosInstance from '@/services/axios';

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
    visibility: 'PRIVATE' | 'PUBLIC';
    userId: number;
    userName: string;
    userEmail: string;
    userImg: string | null;
  };
}

// ✅ 프로필 수정 요청 DTO
export interface ProfileUpdateRequestDto {
  title?: string;
  description?: string;
  skills?: string;
  hourlyRate?: number;
  visibility?: 'PRIVATE' | 'PUBLIC';
}

// ✅ 내 프로필 조회 API
export const getMyProfile = async (): Promise<ProfileResponseDto> => {
  const res = await axiosInstance.get('/profiles/me');
  return res.data as ProfileResponseDto;
};

// ✅ 내 프로필 수정 API
export const updateMyProfile = async (
  data: ProfileUpdateRequestDto
): Promise<ProfileResponseDto> => {
  const res = await axiosInstance.put('/profiles/me', data);
  return res.data as ProfileResponseDto;
};
