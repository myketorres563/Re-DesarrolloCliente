import React from 'react';
import type { Cliente } from '../../types';
import { Users, UserCheck, UserX } from 'lucide-react';

interface ClientStatsProps {
  clientes: Cliente[];
}

export const ClientStats: React.FC<ClientStatsProps> = ({ clientes }) => {
  const total = clientes.length;
  const activos = clientes.filter((c) => c.estado === 'activo').length;
  const inactivos = total - activos;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}
    >
      {/* Total Card */}
      <div 
        className="glass-card" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          borderLeft: '4px solid var(--color-primary)'
        }}
      >
        <div
          style={{
            padding: '12px',
            borderRadius: 'var(--border-radius-sm)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--color-primary)',
          }}
        >
          <Users size={28} />
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Clientes Registrados
          </span>
          <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>{total}</span>
        </div>
      </div>

      {/* Activos Card */}
      <div 
        className="glass-card" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          borderLeft: '4px solid var(--color-success)'
        }}
      >
        <div
          style={{
            padding: '12px',
            borderRadius: 'var(--border-radius-sm)',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--color-success)',
          }}
        >
          <UserCheck size={28} />
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Clientes Activos
          </span>
          <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>{activos}</span>
        </div>
      </div>

      {/* Inactivos Card */}
      <div 
        className="glass-card" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          borderLeft: '4px solid var(--color-danger)'
        }}
      >
        <div
          style={{
            padding: '12px',
            borderRadius: 'var(--border-radius-sm)',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: 'var(--color-danger)',
          }}
        >
          <UserX size={28} />
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Clientes Inactivos
          </span>
          <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>{inactivos}</span>
        </div>
      </div>
    </div>
  );
};
