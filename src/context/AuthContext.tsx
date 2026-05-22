import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthState } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  useMockBackend: boolean;
  setUseMockBackend: (useMock: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  const [useMockBackend, _setUseMockBackend] = useState<boolean>(() => {
    const stored = localStorage.getItem('use_mock_backend');
    // Por defecto es true para asegurar que funcione Out-Of-The-Box de forma ultra simple.
    return stored ? stored === 'true' : true;
  });

  const setUseMockBackend = (useMock: boolean) => {
    localStorage.setItem('use_mock_backend', useMock.toString());
    _setUseMockBackend(useMock);
    addToast(
      useMock 
        ? 'Backend cambiado a: Local Simulado (Sin servidor)' 
        : 'Backend cambiado a: API REST Real (http://localhost:5000)',
      'info'
    );
  };

  // Cargar sesión persistida al iniciar
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('auth_user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        setState({
          user,
          token,
          isAuthenticated: true,
          loading: false,
        });
      } catch (e) {
        // En caso de corrupción, limpiar
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setState((prev) => ({ ...prev, loading: false }));
      }
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      if (useMockBackend) {
        // Simular latencia de red de 800ms
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (email === 'admin@example.com' && password === 'admin') {
          const mockUser: User = {
            id: '1',
            email: 'admin@example.com',
            nombre: 'Administrador',
            role: 'admin',
          };
          const mockToken = 'mock-jwt-token-for-admin';

          localStorage.setItem('auth_token', mockToken);
          localStorage.setItem('auth_user', JSON.stringify(mockUser));

          setState({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            loading: false,
          });
          return true;
        } else {
          throw new Error('Credenciales incorrectas. Usa admin@example.com y admin');
        }
      } else {
        // Petición real al backend configurado en .env
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Fallo de autenticación en servidor');
        }

        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));

        setState({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          loading: false,
        });
        return true;
      }
    } catch (error: any) {
      addToast(error.message || 'Error en el inicio de sesión', 'error');
      setState((prev) => ({ ...prev, loading: false }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
    addToast('Sesión cerrada correctamente', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        useMockBackend,
        setUseMockBackend,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
