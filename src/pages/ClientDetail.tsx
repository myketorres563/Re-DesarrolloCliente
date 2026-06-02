import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Cliente } from '../types';
import { clientService } from '../services/clientService';
import { useToast } from '../components/ToastContext';
import { useAuth } from '../auth/authContext';
import { Button } from '../components/Button';
import { ArrowLeft, Edit2, Mail, Phone, Building, Calendar, UserCheck, ShieldAlert } from 'lucide-react';

export const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { useMockBackend } = useAuth();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await clientService.getClientById(id);
        setCliente(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error al obtener la información del cliente.');
        addToast(err.message || 'Error al obtener la información del cliente.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientDetail();
  }, [id, useMockBackend]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="animate-fade-in client-detail-wrapper">
      
      {/* Botón de retorno */}
      <Link
        to="/dashboard"
        className="client-detail-back-link"
      >
        <ArrowLeft size={16} />
        Volver al Panel de Control
      </Link>

      {/* Carga e información */}
      {isLoading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p className="dashboard-loading-text">
            Obteniendo ficha de cliente...
          </p>
        </div>
      ) : error ? (
        <div className="glass-card dashboard-error-card">
          <ShieldAlert size={48} color="var(--color-danger)" />
          <h3 className="dashboard-error-title">Error al cargar</h3>
          <p className="dashboard-error-desc">
            {error}
          </p>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Volver a la lista
          </Button>
        </div>
      ) : cliente ? (
        <div className="glass-card client-detail-card">
          
          {/* Cabecera del Detalle */}
          <div className="client-detail-header">
            <div>
              <span className={`badge ${cliente.estado === 'activo' ? 'badge-active' : 'badge-inactive'} client-detail-badge`}>
                {cliente.estado}
              </span>
              <h2 className="client-detail-title">
                {cliente.nombre}
              </h2>
            </div>

            <Link to={`/clientes/editar/${cliente.id}`} className="btn btn-secondary client-detail-edit-btn">
              <Edit2 size={16} className="client-card-btn-edit" />
              Editar Ficha
            </Link>
          </div>

          {/* Grid de atributos */}
          <div className="client-detail-grid">
            {/* Correo Electrónico */}
            <div className="client-detail-item">
              <div className="client-detail-icon-wrapper">
                <Mail size={20} />
              </div>
              <div>
                <span className="client-detail-label">
                  Correo Electrónico
                </span>
                <span className="client-detail-value">
                  {cliente.email}
                </span>
              </div>
            </div>

            {/* Teléfono */}
            <div className="client-detail-item">
              <div className="client-detail-icon-wrapper">
                <Phone size={20} />
              </div>
              <div>
                <span className="client-detail-label">
                  Teléfono de Contacto
                </span>
                <span className={`client-detail-value ${cliente.telefono ? '' : 'muted'}`}>
                  {cliente.telefono || 'Sin registrar'}
                </span>
              </div>
            </div>

            {/* Empresa */}
            <div className="client-detail-item">
              <div className="client-detail-icon-wrapper">
                <Building size={20} />
              </div>
              <div>
                <span className="client-detail-label">
                  Organización / Empresa
                </span>
                <span className={`client-detail-value ${cliente.empresa ? '' : 'muted'}`}>
                  {cliente.empresa || 'Sin registrar'}
                </span>
              </div>
            </div>

            {/* Fecha de Registro */}
            <div className="client-detail-item">
              <div className="client-detail-icon-wrapper">
                <Calendar size={20} />
              </div>
              <div>
                <span className="client-detail-label">
                  Fecha de Alta
                </span>
                <span className="client-detail-value">
                  {formatDate(cliente.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Información Adicional Premium */}
          <div className="client-detail-audit-box">
            <UserCheck size={20} className="client-detail-audit-icon" />
            <p className="client-detail-audit-text">
              Este cliente está registrado en el sistema bajo directivas de seguridad asíncrona. Cualquier cambio sobre su perfil auditará los logs del JWT actual del administrador de manera encriptada.
            </p>
          </div>

        </div>
      ) : null}
    </div>
  );
};



