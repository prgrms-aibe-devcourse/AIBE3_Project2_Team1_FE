import axios from 'axios';
import type { ReviewRequestDto, CommonResponse } from '../types/types';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
    // 나중에 로그인 연동 시:
    // Authorization: `Bearer ${token}`,
  },
});

// 리뷰 등록 API
export const postReview = async (dto: ReviewRequestDto) => {
  const response = await api.post<CommonResponse<string>>('/reviews', dto);
  return response.data;
};
