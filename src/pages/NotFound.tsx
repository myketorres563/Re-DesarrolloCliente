import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        minHeight: '60vh',
      }}
    >
      {/* Icono animado */}
      <div
        style={{
          position: 'relative',
          display: 'inline-flex',
          padding: '24px',
          borderRadius: '50%',
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          color: 'var(--color-primary)',
          marginBottom: '28px',
          boxShadow: 'var(--glow-primary)',
        }}
      >
        <Compass
          size={56}
          style={{
            animation: 'spin 12s linear infinite',
          }}
        />
        <HelpCircle
          size={20}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            color: 'var(--color-warning)',
          }}
        />
      </div>

      {/* Título de error */}
      <h1
        style={{
          fontSize: '6rem',
          fontWeight: 900,
          lineHeight: 1,
          marginBottom: '12px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-danger))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.05em',
        }}
      >
        404
      </h1>

      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '16px' }}>
        Dirección No Encontrada
      </h2>

      <p
        style={{
          color: 'var(--text-secondary)',
          maxWidth: '480px',
          lineHeight: 1.6,
          marginBottom: '36px',
          fontSize: '0.95rem',
        }}
      >
        Lo sentimos, la página a la que intentas acceder no existe, ha sido desplazada de forma encriptada o no tienes los privilegios JWT necesarios.
      </p>

      {/* Botón de retorno */}
      <Link
        to="/"
        className="btn btn-primary"
        style={{
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <ArrowLeft size={16} />
        Volver a un Lugar Seguro
      </Link>
    </div>
  );
};
