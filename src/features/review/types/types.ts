export interface ReviewRequestDto {
  projectId: number;
  rating: number;
  comment: string;
  images?: string[];
}

export interface CommonResponse<T> {
  errorCode: number;
  message: string;
  data: T;
}
