import React, { useState, useEffect } from 'react';
import type { Cliente } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClientFormProps {
  initialData?: Cliente;
  onSubmit: (data: Omit<Cliente, 'id' | 'createdAt'>) => Promise<void>;
  isSubmitting: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    estado: 'activo' as 'activo' | 'inactivo',
    telefono: '',
    empresa: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos iniciales si es edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        email: initialData.email || '',
        estado: initialData.estado || 'activo',
        telefono: initialData.telefono || '',
        empresa: initialData.empresa || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });
    }
  };

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) {
      tempErrors.nombre = 'El nombre es obligatorio.';
    }
    
    if (!formData.email.trim()) {
      tempErrors.email = 'El correo electrónico es obligatorio.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        tempErrors.email = 'El correo electrónico no es válido.';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        {/* Nombre */}
        <Input
          label="Nombre Completo *"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          placeholder="Ej: Juan Pérez Gómez"
          required
        />

        {/* Correo Electrónico */}
        <Input
          label="Correo Electrónico *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Ej: juan.perez@empresa.com"
          required
        />

        {/* Teléfono */}
        <Input
          label="Teléfono"
          name="telefono"
          type="text"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Ej: +34 600 112 233"
        />

        {/* Empresa */}
        <Input
          label="Empresa"
          name="empresa"
          type="text"
          value={formData.empresa}
          onChange={handleChange}
          placeholder="Ej: Tecnologías del Sur S.L."
        />

        {/* Estado */}
        <div className="form-group">
          <label htmlFor="select-estado" className="form-label">
            Estado del Cliente *
          </label>
          <select
            id="select-estado"
            name="estado"
            className="form-select"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        {/* Botones de acción */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '28px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px',
          }}
        >
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            disabled={isSubmitting}
          >
            <X size={16} />
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            isLoading={isSubmitting}
          >
            <Save size={16} />
            Guardar Cliente
          </Button>
        </div>
      </div>
    </form>
  );
};
