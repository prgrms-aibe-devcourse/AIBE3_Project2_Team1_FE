import type { User } from '@/services/user';
import type { Dispatch, SetStateAction } from 'react';
import { createContext, useContext } from 'react';

export interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  setUser: () => {},
  loading: false,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  return context;
};
