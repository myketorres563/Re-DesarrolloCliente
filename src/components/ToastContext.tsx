import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react'; // Iconos de la librería Lucide

// Definición de tipos de notificaciones soportados por la interfaz
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Interface que define la estructura interna de cada objeto mensaje
export interface ToastMessage {
  id: string; // ID único basado en timestamp para poder borrarlo
  message: string; // El texto legible que verá el usuario
  type: ToastType; // El color/estilo de la alerta
}

// Interfaz del Contexto
interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Array de toasts activos que se están pintando en pantalla en este instante
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  /**
   * Función asíncrona optimizada con useCallback para agregar una alerta al array.
   * useCallback evita recrear la función innecesariamente en cada ciclo de render.
   */
  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString(); // Genera un ID único temporal
    
    // Inserta la nueva alerta al final del array anterior
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Configura un temporizador para auto-eliminar el mensaje después de 3.5 segundos (3500ms)
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, []);

  /**
   * Función para remover una alerta de la pantalla filtrando el array por ID.
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children} {/* Renderiza el resto de componentes de la aplicación */}
      
      {/* CAPA VISUAL DE NOTIFICACIONES (TOAST CONTAINER) */}
      {/* Se sitúa flotando arriba en una esquina mediante CSS absoluto/fijo en index.css */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type} glass-card`}>
            {/* Cuerpo de la alerta: Selecciona icono y color según el tipo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              {toast.type === 'success' && <CheckCircle size={20} color="var(--color-success)" />}
              {toast.type === 'error' && <AlertCircle size={20} color="var(--color-danger)" />}
              {toast.type === 'warning' && <AlertTriangle size={20} color="var(--color-warning)" />}
              {toast.type === 'info' && <Info size={20} color="var(--color-primary)" />}
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>
            </div>
            
            {/* Botón de cierre manual (X) */}
            <button 
              onClick={() => removeToast(toast.id)} 
              style={{ cursor: 'pointer', display: 'flex', color: 'var(--text-secondary)' }}
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook de consumo rápido para disparar notificaciones
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
  }
  return context;
};

