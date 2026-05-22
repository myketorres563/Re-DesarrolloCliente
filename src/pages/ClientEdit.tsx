import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { clientService } from '../services/clientService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ClientForm } from '../components/clients/ClientForm';
import type { Cliente } from '../types';
import { ArrowLeft, UserCheck, ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const ClientEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { useMockBackend } = useAuth();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener datos iniciales
  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await clientService.getClientById(id);
        setCliente(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error al obtener los datos del cliente.');
        addToast(err.message || 'Error al obtener los datos del cliente.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [id, useMockBackend]);

  const handleSubmit = async (formData: Omit<Cliente, 'id' | 'createdAt'>) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await clientService.updateClient(id, formData);
      addToast('Datos del cliente actualizados con éxito.', 'success');
      navigate(`/clientes/${id}`);
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Error al actualizar el cliente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Retorno */}
      <Link
        to={id ? `/clientes/${id}` : '/dashboard'}
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
        Volver a la Ficha
      </Link>

      {/* Título de la página */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <div
          style={{
            padding: '10px',
            borderRadius: 'var(--border-radius-sm)',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            color: 'var(--color-warning)',
            display: 'flex',
          }}
        >
          <UserCheck size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Editar Cliente
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            Modifica la ficha de datos y estado del cliente.
          </p>
        </div>
      </div>

      {/* Carga, Error o Formulario */}
      {isLoading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            Obteniendo ficha editable...
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
            Volver al Panel
          </Button>
        </div>
      ) : cliente ? (
        <ClientForm
          initialData={cliente}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      ) : null}

    </div>
  );
};
