import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ToastContext'; // Proveedor del sistema de notificaciones flotantes (toasts)
import { AuthProvider } from './auth/authContext'; // Proveedor del estado de inicio de sesión y usuario actual
import { AppLayout } from './layout/AppLayout'; // Envoltura visual común (Header, Footer, Contenedor centrado)
import { ProtectedRoute } from './routing/ProtectedRoute'; // Guardia que protege rutas privadas

// Importación de las páginas de la aplicación
import { Home } from './pages/Home'; // Página de inicio/bienvenida pública
import { Login } from './pages/Login'; // Formulario de inicio de sesión público
import { Dashboard } from './pages/Dashboard'; // Panel de control de clientes (Privado)
import { ClientDetail } from './pages/ClientDetail'; // Detalle o ficha completa de un cliente (Privado)
import { ClientCreate } from './pages/ClientCreate'; // Formulario de alta para un nuevo cliente (Privado)
import { ClientEdit } from './pages/ClientEdit'; // Formulario de edición de un cliente existente (Privado)
import { NotFound } from './components/NotFound'; // Página de error 404 para rutas inexistentes

import './App.css'; // Estilos específicos de este componente base

const App: React.FC = () => {
  return (
    /* ToastProvider: Permite que cualquier componente hijo pueda lanzar notificaciones en pantalla en cualquier momento */
    <ToastProvider>
      {/* AuthProvider: Almacena si el usuario está logueado, sus datos y token JWT, y distribuye esa info a toda la app */}
      <AuthProvider>
        {/* BrowserRouter: Habilita el enrutamiento dinámico en el navegador sin recargar la página */}
        <BrowserRouter>
          {/* AppLayout: Pinta la estructura fija (la cabecera con el menú y el pie de página) alrededor de cada vista */}
          <AppLayout>
            {/* Routes: Mapea la dirección URL escrita en el navegador con la vista/página correspondiente */}
            <Routes>
              {/* === Rutas Públicas (Cualquier visitante puede verlas) === */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/* === Rutas Privadas Protegidas (Solo accesibles si estás autenticado) === */}
              {/* Si no estás autenticado, ProtectedRoute detectará la falta de sesión y te redirigirá a "/login" automáticamente */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clientes/nuevo"
                element={
                  <ProtectedRoute>
                    <ClientCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clientes/:id"
                element={
                  <ProtectedRoute>
                    <ClientDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clientes/editar/:id"
                element={
                  <ProtectedRoute>
                    <ClientEdit />
                  </ProtectedRoute>
                }
              />

              {/* === Ruta Comodín (404 Not Found) === */}
              {/* Si la URL ingresada no coincide con ninguna ruta anterior, se renderiza la página de error 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;

