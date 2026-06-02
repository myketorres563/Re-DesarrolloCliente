import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-card animate-slide-up modal-box">
        <div className="modal-header">
          <div className={`modal-icon-wrapper ${isDanger ? 'modal-icon-danger' : 'modal-icon-warning'}`}>
            <AlertTriangle size={24} />
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>

        <p className="modal-message">
          {message}
        </p>

        <div className="modal-actions">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
