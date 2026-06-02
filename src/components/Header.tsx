import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { LayoutDashboard, LogOut, User, Sparkles, Home } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
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
    <header className="app-header">
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="header-logo-link">
          <div className="header-logo-icon">
            <Sparkles size={18} color="#FFF" />
          </div>
          <span className="header-logo-text">
            CLIENT<span style={{ color: 'var(--color-primary)' }}>FLOW</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="header-nav">
          <Link
            to="/"
            className={`header-nav-link ${isActive('/') ? 'active' : 'inactive'}`}
          >
            <Home size={15} />
            Inicio
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`header-nav-link ${isActive('/dashboard') ? 'active' : 'inactive'}`}
            >
              <LayoutDashboard size={15} />
              Panel de Control
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="header-right-actions">
          {/* User auth summary */}
          {isAuthenticated ? (
            <div className="header-user-wrapper">
              <div className="header-user-badge">
                <User size={13} className="header-user-icon" />
                <span className="header-user-name">{user?.nombre}</span>
              </div>

              <button
                className="btn btn-secondary btn-sm header-logout-btn"
                onClick={handleLogout}
                title="Cerrar sesión"
              >
                <LogOut size={13} />
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
