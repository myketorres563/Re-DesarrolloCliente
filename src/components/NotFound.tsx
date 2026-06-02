import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="animate-fade-in notfound-wrapper">
      {/* Icono animado */}
      <div className="notfound-icon-container">
        <Compass size={56} className="notfound-icon-compass" />
        <HelpCircle size={20} className="notfound-icon-help" />
      </div>

      {/* Título de error */}
      <h1 className="notfound-code">
        404
      </h1>

      <h2 className="notfound-title">
        Dirección No Encontrada
      </h2>

      <p className="notfound-message">
        Lo sentimos, la página a la que intentas acceder no existe, ha sido desplazada de forma encriptada o no tienes los privilegios JWT necesarios.
      </p>

      {/* Botón de retorno */}
      <Link
        to="/"
        className="btn btn-primary notfound-btn"
      >
        <ArrowLeft size={16} />
        Volver a un Lugar Seguro
      </Link>
    </div>
  );
};
