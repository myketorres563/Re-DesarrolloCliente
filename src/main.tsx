import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Estilos globales de la aplicación
import App from './App.tsx'; // Componente principal de la aplicación

// Busca el elemento con id="root" en index.html y renderiza en él la aplicación
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

