import { AuthContext } from '@/features/auth/AuthContext';
import { type User } from '@/services/user';
import { type ReactNode, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch (error) {
        console.error('저장된 사용자 정보 파싱 실패:', error);
        // 손상된 데이터 정리
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      }
    }
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
