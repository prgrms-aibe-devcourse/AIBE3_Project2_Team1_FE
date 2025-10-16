import { axiosInstance } from '@/services/axios';
import { useEffect, useState } from 'react';
import type { ReviewItem } from '../types';

export default function useMyReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get<ReviewItem[]>('/dashboard/reviews')
      .then((res) => setReviews(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  return { reviews, loading, error };
}
