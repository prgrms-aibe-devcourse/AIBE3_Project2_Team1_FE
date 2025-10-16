import { axiosInstance } from '@/services/axios';
import { useEffect, useState } from 'react';
import type { ProjectItem } from '../types';

export default function useInProgressProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get<ProjectItem[]>('/dashboard/projects', { params: { status: 'IN_PROGRESS' } })
      .then((res) => setProjects(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading, error };
}
