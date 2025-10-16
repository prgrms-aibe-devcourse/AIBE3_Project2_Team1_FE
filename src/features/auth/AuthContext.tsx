import type { User } from '@/services/user';
import { getMyInfo } from '@/services/user';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AuthContext } from './auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      getMyInfo()
        .then((data) =>
          setUser({
            nickname: data.data.item.nickname,
            id: data.data.item.id,
            accessToken: data.accessToken,
            apiKey: data.data.apiKey,
          })
        )
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>;
};
