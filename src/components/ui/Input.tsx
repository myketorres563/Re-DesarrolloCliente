import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="form-group">
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`form-input ${error ? 'border-danger' : ''} ${className}`}
          style={error ? { borderColor: 'var(--color-danger)', boxShadow: '0 0 0 1px var(--color-danger)' } : {}}
          {...props}
        />
        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
