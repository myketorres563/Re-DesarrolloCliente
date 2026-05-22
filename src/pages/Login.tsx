import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Lock, LogIn, KeyRound } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!email.trim()) {
      tempErrors.email = 'El correo electrónico es obligatorio.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        tempErrors.email = 'El correo electrónico no es válido.';
      }
    }

    if (!password) {
      tempErrors.password = 'La contraseña es obligatoria.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);

    if (success) {
      addToast('¡Inicio de sesión correcto! Bienvenido de nuevo.', 'success');
      navigate('/dashboard', { replace: true });
    }
  };

  // Rellenar automáticamente credenciales de prueba
  const handleFillDemo = () => {
    setEmail('admin@example.com');
    setPassword('admin');
    setErrors({});
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      <div 
        className="glass-card" 
        style={{ 
          width: '100%', 
          maxWidth: '420px', 
          padding: '36px',
          boxShadow: 'var(--shadow-lg)',
          borderRadius: 'var(--border-radius-md)'
        }}
      >
        {/* Cabecera del Formulario */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '12px',
              borderRadius: '50%',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--color-primary)',
              marginBottom: '16px',
            }}
          >
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Iniciar Sesión</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Accede de forma segura a la gestión de clientes
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
            }}
            error={errors.email}
            placeholder="admin@example.com"
            required
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
            }}
            error={errors.password}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            isLoading={isSubmitting}
          >
            <LogIn size={18} />
            Acceder
          </Button>
        </form>

        {/* Tarjeta de Demo Credenciales */}
        <div
          style={{
            marginTop: '24px',
            padding: '14px 18px',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px dashed rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--border-radius-sm)',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginBottom: '8px', color: 'var(--color-warning)', fontWeight: 600, fontSize: '0.85rem' }}>
            <KeyRound size={14} />
            Credenciales de Prueba
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.4 }}>
            Email: <strong>admin@example.com</strong><br />
            Contraseña: <strong>admin</strong>
          </p>
          <button
            onClick={handleFillDemo}
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-warning)',
              fontWeight: 600,
              textDecoration: 'underline',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
            }}
          >
            Rellenar automáticamente
          </button>
        </div>
      </div>
    </div>
  );
};
