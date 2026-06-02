import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { clientService } from '../services/clientService';
import { useToast } from '../components/ToastContext';
import { useAuth } from '../auth/authContext';
import { ClientForm } from '../components/ClientForm';
import type { Cliente } from '../types';
import { ArrowLeft, UserCheck, ShieldAlert } from 'lucide-react';
import { Button } from '../components/Button';

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
    <div className="animate-fade-in client-crud-wrapper">
      
      {/* Retorno */}
      <Link
        to={id ? `/clientes/${id}` : '/dashboard'}
        className="client-crud-back-link"
      >
        <ArrowLeft size={16} />
        Volver a la Ficha
      </Link>

      {/* Título de la página */}
      <div className="client-crud-header">
        <div className="client-crud-icon-wrapper client-crud-icon-edit">
          <UserCheck size={22} />
        </div>
        <div>
          <h2 className="client-crud-title">
            Editar Cliente
          </h2>
          <p className="client-crud-desc">
            Modifica la ficha de datos y estado del cliente.
          </p>
        </div>
      </div>

      {/* Carga, Error o Formulario */}
      {isLoading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p className="dashboard-loading-text">
            Obteniendo ficha editable...
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
