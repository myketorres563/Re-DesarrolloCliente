import React from 'react';
import { Link } from 'react-router-dom';
import type { Cliente } from '../../types';
import { Mail, Phone, Building, Eye, Edit2, Trash2 } from 'lucide-react';

interface ClientCardProps {
  cliente: Cliente;
  onDeleteClick: (id: string) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ cliente, onDeleteClick }) => {
  const { id, nombre, email, estado, telefono, empresa } = cliente;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Cabecera de la tarjeta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <span className={`badge ${estado === 'activo' ? 'badge-active' : 'badge-inactive'}`}>
          {estado}
        </span>
      </div>

      {/* Nombre */}
      <h3 
        style={{ 
          fontSize: '1.2rem', 
          fontWeight: 600, 
          marginBottom: '16px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em'
        }}
      >
        {nombre}
      </h3>

      {/* Info básica */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <Mail size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={email}>
            {email}
          </span>
        </div>

        {telefono && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <Phone size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <span>{telefono}</span>
          </div>
        )}

        {empresa && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <Building size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <span>{empresa}</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Link
          to={`/clientes/${id}`}
          className="btn btn-secondary btn-sm"
          style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
          title="Ver Ficha Detallada"
        >
          <Eye size={14} />
          Detalles
        </Link>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            to={`/clientes/editar/${id}`}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', color: 'var(--color-warning)' }}
            title="Editar cliente"
          >
            <Edit2 size={14} />
          </Link>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onDeleteClick(id)}
            style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', color: 'var(--color-danger)' }}
            title="Eliminar cliente"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
