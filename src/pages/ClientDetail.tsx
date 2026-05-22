import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Cliente } from '../types';
import { clientService } from '../services/clientService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
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
    <div className="animate-fade-in" style={{ maxWidth: '750px', margin: '0 auto' }}>
      
      {/* Botón de retorno */}
      <Link
        to="/dashboard"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '24px',
          fontWeight: 500,
          transition: 'color var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <ArrowLeft size={16} />
        Volver al Panel de Control
      </Link>

      {/* Carga e información */}
      {isLoading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            Obteniendo ficha de cliente...
          </p>
        </div>
      ) : error ? (
        <div
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: '40px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <ShieldAlert size={48} color="var(--color-danger)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Error al cargar</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {error}
          </p>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Volver a la lista
          </Button>
        </div>
      ) : cliente ? (
        <div className="glass-card" style={{ padding: '36px' }}>
          
          {/* Cabecera del Detalle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '24px',
              marginBottom: '28px',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <span 
                className={`badge ${cliente.estado === 'activo' ? 'badge-active' : 'badge-inactive'}`}
                style={{ marginBottom: '12px' }}
              >
                {cliente.estado}
              </span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                {cliente.nombre}
              </h2>
            </div>

            <Link to={`/clientes/editar/${cliente.id}`} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit2 size={16} style={{ color: 'var(--color-warning)' }} />
              Editar Ficha
            </Link>
          </div>

          {/* Grid de atributos */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Correo Electrónico */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  padding: '10px',
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  color: 'var(--color-primary)',
                }}
              >
                <Mail size={20} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '4px' }}>
                  Correo Electrónico
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {cliente.email}
                </span>
              </div>
            </div>

            {/* Teléfono */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  padding: '10px',
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  color: 'var(--color-primary)',
                }}
              >
                <Phone size={20} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '4px' }}>
                  Teléfono de Contacto
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 500, color: cliente.telefono ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {cliente.telefono || 'Sin registrar'}
                </span>
              </div>
            </div>

            {/* Empresa */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  padding: '10px',
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  color: 'var(--color-primary)',
                }}
              >
                <Building size={20} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '4px' }}>
                  Organización / Empresa
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 500, color: cliente.empresa ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {cliente.empresa || 'Sin registrar'}
                </span>
              </div>
            </div>

            {/* Fecha de Registro */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  padding: '10px',
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  color: 'var(--color-primary)',
                }}
              >
                <Calendar size={20} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '4px' }}>
                  Fecha de Alta
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {formatDate(cliente.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Información Adicional Premium */}
          <div
            style={{
              marginTop: '36px',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <UserCheck size={20} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Este cliente está registrado en el sistema bajo directivas de seguridad asíncrona. Cualquier cambio sobre su perfil auditará los logs del JWT actual del administrador de manera encriptada.
            </p>
          </div>

        </div>
      ) : null}
    </div>
  );
};
