import type { ReviewRequestDto, CommonResponse } from '../types/types';
import axiosInstance from '@/services/axios';

export const postReview = async (dto: ReviewRequestDto) => {
  const response = await axiosInstance.post<CommonResponse<string>>('/reviews', dto);
  return response.data;
};
