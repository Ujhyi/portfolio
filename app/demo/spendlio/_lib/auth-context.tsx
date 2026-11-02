'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, getStoredToken } from './api-client';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTokenState(getStoredToken());
    setIsLoading(false);
  }, []);

  function setToken(newToken: string | null) {
    setTokenState(newToken);
    if (newToken === null) api.logout();
  }

  return (
    <AuthContext.Provider value={{ token, setToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth musí byť použité vnútri AuthProvider');
  }
  return context;
}
