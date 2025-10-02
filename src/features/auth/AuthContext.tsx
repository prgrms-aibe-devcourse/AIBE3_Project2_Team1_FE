// src/contexts/AuthContext.ts
import { createContext } from 'react';

export type User = {
  nickname?: string;
  [key: string]: unknown;
};

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});
