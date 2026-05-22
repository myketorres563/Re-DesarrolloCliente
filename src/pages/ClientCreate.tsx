import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { clientService } from '../services/clientService';
import { useToast } from '../context/ToastContext';
import { ClientForm } from '../components/clients/ClientForm';
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
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Retorno */}
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
        Volver al Panel
      </Link>

      {/* Título de la página */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <div
          style={{
            padding: '10px',
            borderRadius: 'var(--border-radius-sm)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--color-primary)',
            display: 'flex',
          }}
        >
          <UserPlus size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Alta de Cliente
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            Completa los datos para incorporar un nuevo cliente a la base de datos.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <ClientForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

    </div>
  );
};
