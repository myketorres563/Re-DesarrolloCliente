import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { Shield, ArrowRight, Layers, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="animate-fade-in home-wrapper">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="home-hero-badge">
           Práctica Final de Desarrollo Frontend en React
        </div>
        
        <h1 className="home-hero-title">
          Gestiona tus clientes de forma <span className="home-hero-span">segura y fluida</span>
        </h1>
        
        <p className="home-hero-text">
          Una solución profesional y minimalista para la administración de clientes. Desarrollada con React, TypeScript y conectada de forma asíncrona mediante JWT a una API REST corporativa.
        </p>

        <div className="home-hero-actions">
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="btn btn-primary home-hero-btn"
          >
            {isAuthenticated ? 'Ir al Panel de Control' : 'Demo de Acceso'}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Características */}
      <h2 className="home-features-title">
        ¿Qué ofrece ClientFlow?
      </h2>

      <div className="home-features-grid">
        {/* Card 1: JWT */}
        <div className="glass-card home-feature-card">
          <div className="home-feature-icon-wrapper home-feature-icon-jwt">
            <Shield size={24} />
          </div>
          <h3 className="home-feature-title-text">Seguridad JWT</h3>
          <p className="home-feature-desc">
            Acceso seguro mediante tokens JSON Web Token persistidos. Las páginas y endpoints privados están totalmente protegidos de accesos no autorizados.
          </p>
        </div>

        {/* Card 2: CRUD */}
        <div className="glass-card home-feature-card">
          <div className="home-feature-icon-wrapper home-feature-icon-crud">
            <Layers size={24} />
          </div>
          <h3 className="home-feature-title-text">Gestión CRUD Completa</h3>
          <p className="home-feature-desc">
            Alta, visualización detallada, edición y eliminación de clientes con actualizaciones instantáneas y reactivas del estado global.
          </p>
        </div>

        {/* Card 3: Diseño de Vanguardia */}
        <div className="glass-card home-feature-card">
          <div className="home-feature-icon-wrapper home-feature-icon-dual">
            <Sparkles size={24} />
          </div>
          <h3 className="home-feature-title-text">Diseño de Vanguardia</h3>
          <p className="home-feature-desc">
            Estética premium en modo oscuro con componentes de cristal esmerilado (glassmorphism), tipografía refinada y micro-animaciones fluidas en CSS nativo.
          </p>
        </div>
      </div>
    </div>
  );
};
