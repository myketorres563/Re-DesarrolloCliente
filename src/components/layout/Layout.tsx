import React from 'react';
import { Header } from './Header';
import { Heart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ flex: 1, padding: '40px 0' }} className="animate-fade-in">
        <div className="container">
          {children}
        </div>
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'rgba(5, 7, 13, 0.4)',
          padding: '24px 0',
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Desarrollado con <Heart size={14} color="var(--color-danger)" fill="var(--color-danger)" /> por Miguel Ángel – Práctica Final React + TS
          </p>
          <p>© {new Date().getFullYear()} ClientFlow Corp. Conexión asíncrona segura con JWT.</p>
        </div>
      </footer>
    </div>
  );
};
