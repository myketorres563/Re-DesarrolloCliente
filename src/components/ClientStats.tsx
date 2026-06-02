import React from 'react';
import type { Cliente } from '../types';
import { Users, UserCheck, UserX } from 'lucide-react';

interface ClientStatsProps {
  clientes: Cliente[];
}

export const ClientStats: React.FC<ClientStatsProps> = ({ clientes }) => {
  const total = clientes.length;
  const activos = clientes.filter((c) => c.estado === 'activo').length;
  const inactivos = total - activos;

  return (
    <div className="stats-grid">
      {/* Total Card */}
      <div className="glass-card stats-card stats-card-total">
        <div className="stats-icon-wrapper stats-icon-total">
          <Users size={28} />
        </div>
        <div>
          <span className="stats-label">
            Clientes Registrados
          </span>
          <span className="stats-value">{total}</span>
        </div>
      </div>

      {/* Activos Card */}
      <div className="glass-card stats-card stats-card-active">
        <div className="stats-icon-wrapper stats-icon-active">
          <UserCheck size={28} />
        </div>
        <div>
          <span className="stats-label">
            Clientes Activos
          </span>
          <span className="stats-value">{activos}</span>
        </div>
      </div>

      {/* Inactivos Card */}
      <div className="glass-card stats-card stats-card-inactive">
        <div className="stats-icon-wrapper stats-icon-inactive">
          <UserX size={28} />
        </div>
        <div>
          <span className="stats-label">
            Clientes Inactivos
          </span>
          <span className="stats-value">{inactivos}</span>
        </div>
      </div>
    </div>
  );
};
