import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { clientService } from '../services/clientService';
import { useToast } from '../components/ToastContext';
import { ClientForm } from '../components/ClientForm';
import type { Cliente } from '../types';
import { ArrowLeft, UserPlus } from 'lucide-react';

export const ClientCreate: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: Omit<Cliente, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    try {
      await clientService.createClient(formData);
      addToast('Cliente registrado con éxito en el sistema.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'No se pudo crear el cliente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in client-crud-wrapper">
      
      {/* Retorno */}
      <Link
        to="/dashboard"
        className="client-crud-back-link"
      >
        <ArrowLeft size={16} />
        Volver al Panel
      </Link>

      {/* Título de la página */}
      <div className="client-crud-header">
        <div className="client-crud-icon-wrapper client-crud-icon-create">
          <UserPlus size={22} />
        </div>
        <div>
          <h2 className="client-crud-title">
            Alta de Cliente
          </h2>
          <p className="client-crud-desc">
            Completa los datos para incorporar un nuevo cliente a la base de datos.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <ClientForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

    </div>
  );
};
