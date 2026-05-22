import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, LogOut, Server, User, Database, Sparkles, Home } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout, useMockBackend, setUseMockBackend } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'rgba(11, 15, 25, 0.8)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '8px',
              borderRadius: 'var(--border-radius-sm)',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-success))',
              display: 'flex',
              boxShadow: 'var(--glow-primary)',
            }}
          >
            <Sparkles size={20} color="#FFF" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.05em' }}>
            CLIENT<span style={{ color: 'var(--color-primary)' }}>FLOW</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: isActive('/') ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Home size={16} />
            Inicio
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: isActive('/dashboard') ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'color var(--transition-fast)',
              }}
            >
              <LayoutDashboard size={16} />
              Panel de Control
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Dual-Mode Selector Dropdown/Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              borderRadius: '9999px',
              padding: '4px 6px',
            }}
          >
            <button
              onClick={() => setUseMockBackend(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                backgroundColor: useMockBackend ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: useMockBackend ? 'var(--color-primary)' : 'var(--text-secondary)',
                border: useMockBackend ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              }}
              title="Usa almacenamiento LocalStorage con retraso de red simulado"
            >
              <Database size={12} />
              Local
            </button>
            <button
              onClick={() => setUseMockBackend(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                backgroundColor: !useMockBackend ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: !useMockBackend ? 'var(--color-success)' : 'var(--text-secondary)',
                border: !useMockBackend ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              }}
              title="Se comunica con el servidor Express en el puerto 5000"
            >
              <Server size={12} />
              API Real
            </button>
          </div>

          {/* User auth summary */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  padding: '6px 14px',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <User size={14} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{user?.nombre}</span>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Cerrar sesión"
              >
                <LogOut size={14} />
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
