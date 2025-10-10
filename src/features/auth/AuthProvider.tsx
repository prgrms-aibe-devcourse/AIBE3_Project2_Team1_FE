import { AuthContext } from '@/features/auth/AuthContext';
import { getCurrentUser } from '@/features/auth/auth';
import { type User } from '@/services/user';
import { type ReactNode, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // 기본 유효성 검증
          if (parsedUser && typeof parsedUser === 'object') {
            setUser(parsedUser as User);
          } else {
            throw new Error('Invalid user data format');
          }
        } catch (error) {
          console.error('저장된 사용자 정보 파싱 실패:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
        }
      } else {
        try {
          const res = await getCurrentUser();
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (error) {
          console.error('로그인 상태 없음 또는 토큰 만료:', error);
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
        }
      }

      setLoading(false);
    };

    restoreUser();
  }, []);

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>;
};
