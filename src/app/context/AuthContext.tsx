import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  warehouseId: string | null;
  login: (token: string, warehouseId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [warehouseId, setWarehouseId] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('NEXT_PUBLIC_BACKEND_TOKEN');
    const savedWarehouseId = localStorage.getItem('NEXT_PUBLIC_BACKEND_WAREHOUSEID');

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedWarehouseId) {
      setWarehouseId(savedWarehouseId);
    }
  }, []);

  const login = (newToken: string, newWarehouseId: string) => {
    setToken(newToken);
    setWarehouseId(newWarehouseId);

    localStorage.setItem('NEXT_PUBLIC_BACKEND_TOKEN', newToken);
    localStorage.setItem('NEXT_PUBLIC_BACKEND_WAREHOUSEID', newWarehouseId);
  };

  const logout = () => {
    setToken(null);
    setWarehouseId(null);

    localStorage.removeItem('NEXT_PUBLIC_BACKEND_TOKEN');
    localStorage.removeItem('NEXT_PUBLIC_BACKEND_WAREHOUSEID');
  };

  return (
    <AuthContext.Provider value={{ token, warehouseId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// context/AuthContext.tsx
export default AuthProvider;
