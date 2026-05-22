export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  estado: 'activo' | 'inactivo';
  telefono?: string;
  empresa?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
