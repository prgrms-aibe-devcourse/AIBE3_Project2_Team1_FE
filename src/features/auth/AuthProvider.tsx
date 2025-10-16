import { getCurrentUser } from '@/features/auth/auth';
import type { User } from '@/services/user';
import axios from 'axios';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AuthContext } from './auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser as User);
        }

        const res = await getCurrentUser();
        if (res?.data) {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.warn('Access token expired → axiosInstance가 자동 재발급 시도 중...');
          } else {
            console.error('유저 복원 실패 (AxiosError):', error);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            setUser(null);
          }
        } else {
          console.error('유저 복원 실패 (Axios 아님):', error);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>;
};
