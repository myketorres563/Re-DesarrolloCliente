import React, { useState, useEffect } from 'react';
import type { Cliente } from '../types';
import { Input } from './Input'; // Campo de texto personalizado con soporte de errores
import { Button } from './Button'; // Botón estilizado con cargador spinner integrado
import { Save, X } from 'lucide-react'; // Iconos de guardar y cancelar
import { useNavigate } from 'react-router-dom';

// Propiedades (Props) que recibe el componente desde el componente padre
interface ClientFormProps {
  initialData?: Cliente; // Datos iniciales del cliente (opcional: solo se pasa en modo edición)
  onSubmit: (data: Omit<Cliente, 'id' | 'createdAt'>) => Promise<void>; // Función que ejecuta el guardado en el servidor
  isSubmitting: boolean; // Flag de carga del padre para saber si se está procesando la petición HTTP
}

export const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
}) => {
  const navigate = useNavigate();

  // Estado que almacena en tiempo real los valores escritos en las cajas de texto del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    estado: 'activo' as 'activo' | 'inactivo',
    telefono: '',
    empresa: '',
  });

  // Estado para capturar mensajes de error de validación específicos por campo (ej. errors.email = "correo inválido")
  const [errors, setErrors] = useState<Record<string, string>>({});

  // === EFECTO DE PRECARGA PARA EDICIÓN ===
  useEffect(() => {
    // Si el padre nos envía datos de un cliente existente, los cargamos en el formulario
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        email: initialData.email || '',
        estado: initialData.estado || 'activo',
        telefono: initialData.telefono || '',
        empresa: initialData.empresa || '',
      });
    }
  }, [initialData]); // Se reactiva si el cliente inicial cambia (ej. al terminar de cargar la API)

  /**
   * Controlador dinámico de cambio de inputs.
   * Lee la propiedad 'name' del input y actualiza esa misma clave en el estado de React.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Si el campo que se está modificando tenía un error visual, lo limpiamos de inmediato al escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });
    }
  };

  // === VALIDACIONES DEL FORMULARIO ===
  const validate = () => {
    const tempErrors: Record<string, string> = {};
    
    // 1. Validar nombre obligatorio
    if (!formData.nombre.trim()) {
      tempErrors.nombre = 'El nombre es obligatorio.';
    }
    
    // 2. Validar correo obligatorio y con formato correcto
    if (!formData.email.trim()) {
      tempErrors.email = 'El correo electrónico es obligatorio.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular estándar para emails
      if (!emailRegex.test(formData.email)) {
        tempErrors.email = 'El correo electrónico no es válido.';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Retorna true si no hay ningún mensaje de error
  };

  /**
   * Controlador de envío del formulario al pulsar "Guardar" o presionar Enter.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página web se recargue por defecto
    
    if (!validate()) return; // Si hay errores, detiene el envío
    
    await onSubmit(formData); // Ejecuta la función de guardado asíncrono definida por el padre
  };

  return (
    // Renderizamos el formulario con diseño tarjeta de vidrio (glassmorphism)
    <form onSubmit={handleSubmit} className="glass-card client-form-container">
      <div className="client-form-inner">
        
        {/* Campo Nombre Completo */}
        <Input
          label="Nombre Completo *"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          placeholder="Ej: Juan Pérez Gómez"
          required
        />

        {/* Campo Correo Electrónico */}
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

        {/* Campo Teléfono de Contacto */}
        <Input
          label="Teléfono"
          name="telefono"
          type="text"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Ej: +34 600 112 233"
        />

        {/* Campo Organización o Empresa */}
        <Input
          label="Empresa"
          name="empresa"
          type="text"
          value={formData.empresa}
          onChange={handleChange}
          placeholder="Ej: Tecnologías del Sur S.L."
        />

        {/* Campo desplegable del Estado */}
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

        {/* Botones de acción en la parte inferior */}
        <div className="client-form-actions">
          {/* Botón Cancelar: Regresa de inmediato al Panel de Control */}
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            className="client-form-btn-content"
            disabled={isSubmitting}
          >
            <X size={16} />
            Cancelar
          </Button>

          {/* Botón Guardar: Envía y activa el estado de carga/spinner si está guardando */}
          <Button
            type="submit"
            variant="primary"
            className="client-form-btn-content"
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

