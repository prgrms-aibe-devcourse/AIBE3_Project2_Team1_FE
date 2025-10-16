import axios from 'axios';

export interface ReviewRequest {
  projectId: number;
  rating: number;
  comment: string;
  images: string[];
}

export const postReview = (data: ReviewRequest) =>
  axios.post('/api/v1/reviews', data, {
    headers: { 'Content-Type': 'application/json' },
  });
