import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext'; // Consumimos el contexto global de sesión

interface ProtectedRouteProps {
  children: React.ReactNode; // Los componentes de la página protegida que queremos mostrar
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Extraemos la información de si está autenticado y si sigue cargando la sesión persistida
  const { isAuthenticated, loading } = useAuth();

  // 1. Caso de espera: Mientras la app lee las cookies/localStorage para saber si hay sesión
  if (loading) {
    return (
      <div className="protected-route-loading">
        {/* Spinner animado de carga definido en index.css */}
        <div className="spinner"></div>
        <p className="protected-route-text">
          Verificando sesión...
        </p>
      </div>
    );
  }

  // 2. Caso denegado: Si ya terminó de cargar y se confirmó que NO hay usuario conectado
  if (!isAuthenticated) {
    // Redirige al login. 'replace' limpia el historial del navegador para que no pueda volver atrás con el botón "Atrás"
    return <Navigate to="/login" replace />;
  }

  // 3. Caso aprobado: Si hay sesión activa, renderiza los hijos normalmente
  return <>{children}</>;
};

