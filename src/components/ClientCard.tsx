import React from 'react';
import { Link } from 'react-router-dom';
import type { Cliente } from '../types';
import { Mail, Phone, Building, Eye, Edit2, Trash2 } from 'lucide-react';

interface ClientCardProps {
  cliente: Cliente;
  onDeleteClick: (id: string) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ cliente, onDeleteClick }) => {
  const { id, nombre, email, estado, telefono, empresa } = cliente;

  return (
    <div className="glass-card client-card-inner">
      {/* Cabecera de la tarjeta */}
      <div className="client-card-header">
        <span className={`badge ${estado === 'activo' ? 'badge-active' : 'badge-inactive'}`}>
          {estado}
        </span>
      </div>

      {/* Nombre */}
      <h3 className="client-card-name">
        {nombre}
      </h3>

      {/* Info básica */}
      <div className="client-card-body">
        <div className="client-card-info-row">
          <Mail size={16} className="client-card-info-icon" />
          <span className="client-card-info-text" title={email}>
            {email}
          </span>
        </div>

        {telefono && (
          <div className="client-card-info-row">
            <Phone size={16} className="client-card-info-icon" />
            <span>{telefono}</span>
          </div>
        )}

        {empresa && (
          <div className="client-card-info-row">
            <Building size={16} className="client-card-info-icon" />
            <span>{empresa}</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="client-card-actions">
        <Link
          to={`/clientes/${id}`}
          className="btn btn-secondary btn-sm client-card-btn-details"
          title="Ver Ficha Detallada"
        >
          <Eye size={14} />
          Detalles
        </Link>

        <div className="client-card-action-group">
          <Link
            to={`/clientes/editar/${id}`}
            className="btn btn-secondary btn-sm client-card-btn-icon client-card-btn-edit"
            title="Editar cliente"
          >
            <Edit2 size={14} />
          </Link>

          <button
            className="btn btn-secondary btn-sm client-card-btn-icon client-card-btn-delete"
            onClick={() => onDeleteClick(id)}
            title="Eliminar cliente"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
