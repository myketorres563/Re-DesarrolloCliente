import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { useToast } from '../components/ToastContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
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
    <div className="animate-fade-in login-wrapper">
      <div className="glass-card login-card">
        {/* Cabecera del Formulario */}
        <div className="login-header">
          <div className="login-header-icon-wrapper">
            <Lock size={28} />
          </div>
          <h2 className="login-header-title">Iniciar Sesión</h2>
          <p className="login-header-desc">
            Accede de forma segura a la gestión de clientes
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          
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
            className="login-submit-btn"
            isLoading={isSubmitting}
          >
            <LogIn size={18} />
            Acceder
          </Button>
        </form>

        {/* Tarjeta de Demo Credenciales */}
        <div className="login-demo-box">
          <div className="login-demo-title">
            <KeyRound size={14} />
            Credenciales de Prueba
          </div>
      
          <button
            onClick={handleFillDemo}
            className="login-demo-btn"
          >
            Rellenar automáticamente
          </button>
        </div>
      </div>
    </div>
  );
};
