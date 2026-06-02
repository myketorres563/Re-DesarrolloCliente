import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthState } from '../types';
import { useToast } from '../components/ToastContext'; // Para disparar toasts informativos
import { authStorage } from './authStorage'; // Persistencia física en localStorage

// Define qué funciones y datos ofrece el contexto a los componentes que lo consuman
interface AuthContextType {
  user: User | null; // El objeto del usuario conectado (o null)
  token: string | null; // El token de sesión JWT (o null)
  isAuthenticated: boolean; // Flag de acceso rápido (true/false)
  loading: boolean; // Flag para congelar la app mientras lee localStorage al inicio
  useMockBackend: boolean; // Flag para saber si simulamos el backend localmente o usamos el de verdad
  setUseMockBackend: (useMock: boolean) => void; // Función para alternar el flag anterior
  login: (email: string, password: string) => Promise<boolean>; // Función de inicio de sesión
  logout: () => void; // Función de cierre de sesión
}

// 1. Crear el objeto Contexto vacío
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Componente Proveedor que envolverá a <App />
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();

  // Estado que contiene las variables del usuario en memoria activa de React
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true, // Empieza en true para dar tiempo a cargar el localStorage
  });

  // Estado para controlar si usamos la base de datos simulada en localStorage
  const [useMockBackend, _setUseMockBackend] = useState<boolean>(() => {
    return authStorage.getUseMockBackend();
  });

  // Función para alternar entre el servidor real y el backend simulado
  const setUseMockBackend = (useMock: boolean) => {
    authStorage.setUseMockBackend(useMock);
    _setUseMockBackend(useMock);
    
    // Mostramos una alerta en pantalla informando del cambio
    addToast(
      useMock 
        ? 'Backend cambiado a: Local Simulado (Sin servidor)' 
        : 'Backend cambiado a: API REST Real (http://localhost:5000)',
      'info'
    );
  };

  // === EFECTO DE AUTO-LOGUEO AL INICIAR LA APLICACIÓN ===
  useEffect(() => {
    // Al abrir la pestaña, buscamos si ya había un token y un usuario guardados de antes
    const token = authStorage.getToken();
    const user = authStorage.getUser();

    if (token && user) {
      // Si existen, rellenamos el estado de React con las credenciales
      setState({
        user,
        token,
        isAuthenticated: true,
        loading: false, // Ya terminamos de verificar la sesión con éxito
      });
    } else {
      // Si faltaba alguno, nos aseguramos de limpiar todo por seguridad
      authStorage.clearAll();
      setState((prev) => ({ ...prev, loading: false })); // Apagamos la carga inicial
    }
  }, []);

  // === FUNCIÓN DE INICIO DE SESIÓN (LOGIN) ===
  const login = async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true })); // Activamos la rueda de carga del botón
    
    try {
      // --- CASO A: MODO LOCAL SIMULADO (MOCK) ---
      if (useMockBackend) {
        // Simulamos un retraso de red de 800 milisegundos para que se vea más realista
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Validamos credenciales fijas
        if (email === 'admin@example.com' && password === 'admin') {
          const mockUser: User = {
            id: '1',
            email: 'admin@example.com',
            nombre: 'Administrador',
            role: 'admin',
          };
          const mockToken = 'mock-jwt-token-for-admin'; // Token JWT ficticio para la prueba

          // Guardamos físicamente en localStorage para que persista al refrescar (F5)
          authStorage.setToken(mockToken);
          authStorage.setUser(mockUser);

          // Actualizamos la memoria activa de React
          setState({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            loading: false,
          });
          return true;
        } else {
          // Si las credenciales no coinciden, disparamos un error controlado
          throw new Error('Credenciales incorrectas. Usa admin@example.com y admin');
        }
      } 
      // --- CASO B: MODO API REST REAL (CONEXIÓN HTTP AL SERVIDOR NODE) ---
      else {
        // Obtenemos la URL base del backend desde las variables de entorno configuradas
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        // Hacemos una petición POST asíncrona al endpoint de login del servidor
        const response = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }), // Enviamos las credenciales en formato de texto JSON
        });

        const data = await response.json(); // Esperamos y decodificamos la respuesta del servidor

        // Si la respuesta HTTP no es un código exitoso (ej. 401 Unauthorized o 400 Bad Request)
        if (!response.ok) {
          throw new Error(data.error || 'Fallo de autenticación en servidor');
        }

        // Si es exitoso, el servidor nos devuelve el token JWT generado y los datos del usuario
        authStorage.setToken(data.token);
        authStorage.setUser(data.user);

        // Guardamos todo en el estado de React
        setState({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          loading: false,
        });
        return true;
      }
    } catch (error: any) {
      // Capturamos cualquier fallo de red o error de credenciales, avisamos al usuario y apagamos la carga
      addToast(error.message || 'Error en el inicio de sesión', 'error');
      setState((prev) => ({ ...prev, loading: false }));
      return false;
    }
  };

  // === FUNCIÓN DE CIERRE DE SESIÓN (LOGOUT) ===
  const logout = () => {
    // 1. Borramos localStorage por completo
    authStorage.clearAll();
    
    // 2. Limpiamos el estado en memoria de React (vuelve a null)
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
    
    // 3. Avisamos al usuario con una notificación toast verde (success)
    addToast('Sesión cerrada correctamente', 'success');
  };

  return (
    // Proveemos todos los estados y funciones mediante el value del Provider
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
      {children} {/* Se inyecta la aplicación envuelta */}
    </AuthContext.Provider>
  );
};

// 3. Hook personalizado para consumir la sesión en una sola línea de código: const { user, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

