import React from 'react';
import { Header } from '../components/Header'; // La barra de navegación superior con el logo y el login

interface LayoutProps {
  children: React.ReactNode; // Representa la página concreta que se va a pintar dentro del layout (Home, Dashboard, etc.)
}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    // Contenedor principal flex vertical para empujar el footer hacia abajo del todo
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* 1. Cabecera superior fija */}
      <Header />
      
      {/* 2. Área principal de contenido (toma todo el espacio vertical sobrante con flex: 1) */}
      {/* 'animate-fade-in' es una clase en index.css para darle una transición de entrada suave */}
      <main style={{ flex: 1, padding: '40px 0' }} className="animate-fade-in">
        <div className="container">
          {children} {/* Aquí se inyecta la página activa según la ruta actual */}
        </div>
      </main>

      {/* 3. Pie de página inferior */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-surface)',
          padding: '24px 0',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Muestra dinámicamente el año actual en el navegador */}
          <p>© {new Date().getFullYear()} ClientFlow Corp - Todos los Derechos Reservados</p>
        </div>
      </footer>
    </div>
  );
};

