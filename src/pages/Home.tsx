import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Zap, ArrowRight, Layers } from 'lucide-react';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="animate-fade-in" style={{ padding: '20px 0' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 80px auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--color-primary)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '24px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          ✨ Práctica Final de Desarrollo Frontend en React
        </div>
        
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '24px',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #9CA3AF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Gestiona tus clientes de forma <span style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-success))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>segura y fluida</span>
        </h1>
        
        <p
          style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '40px',
            fontWeight: 400,
          }}
        >
          Una solución profesional y minimalista para la administración de clientes. Desarrollada con React, TypeScript y conectada de forma asíncrona mediante JWT a una API REST corporativa.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="btn btn-primary"
            style={{ fontSize: '1.05rem', padding: '12px 28px', borderRadius: 'var(--border-radius-sm)' }}
          >
            {isAuthenticated ? 'Ir al Panel de Control' : 'Comenzar Ahora'}
            <ArrowRight size={18} />
          </Link>
          {!isAuthenticated && (
            <Link
              to="/login"
              className="btn btn-secondary"
              style={{ fontSize: '1.05rem', padding: '12px 28px', borderRadius: 'var(--border-radius-sm)' }}
            >
              Demo de Acceso
            </Link>
          )}
        </div>
      </div>

      {/* Características */}
      <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, marginBottom: '48px' }}>
        ¿Qué ofrece ClientFlow?
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}
      >
        {/* Card 1: JWT */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <Shield size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px' }}>Seguridad JWT</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Acceso seguro mediante tokens JSON Web Token persistidos. Las páginas y endpoints privados están totalmente protegidos de accesos no autorizados.
          </p>
        </div>

        {/* Card 2: CRUD */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <Layers size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px' }}>Gestión CRUD Completa</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Alta, visualización detallada, edición y eliminación de clientes con actualizaciones instantáneas y reactivas del estado global.
          </p>
        </div>

        {/* Card 3: Dual Mode */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <Zap size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px' }}>Soporte Dual de API</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Cambia entre almacenamiento simulado interactivo en local y comunicación HTTP asíncrona real con el backend de forma dinámica con un clic.
          </p>
        </div>
      </div>
    </div>
  );
};
