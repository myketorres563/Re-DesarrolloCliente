import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Cliente } from '../types';
import { clientService } from '../services/clientService'; // Capa de persistencia asíncrona
import { useToast } from '../components/ToastContext'; // Sistema de notificaciones
import { ClientCard } from '../components/ClientCard';
import { ClientStats } from '../components/ClientStats';
import { Modal } from '../components/Modal';
import { Plus, Search, Filter, AlertCircle, RefreshCw, FolderOpen } from 'lucide-react'; // Iconos vectoriales

export const Dashboard: React.FC = () => {
  const { addToast } = useToast();
  
  // === ESTADOS REACTIVOS ===
  const [clients, setClients] = useState<Cliente[]>([]); // Array original completo descargado del servidor
  const [isLoading, setIsLoading] = useState(true); // Flag para mostrar spinner de carga inicial
  const [error, setError] = useState<string | null>(null); // Almacena mensajes de error HTTP si la API falla

  // Estados específicos para los filtros de búsqueda superior
  const [searchTerm, setSearchTerm] = useState(''); // Texto escrito en el buscador
  const [statusFilter, setStatusFilter] = useState<'todos' | 'activo' | 'inactivo'>('todos'); // Estado seleccionado

  // Estados para controlar el flujo de eliminación (Borrado)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Abre/Cierra el modal de confirmación
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null); // ID del cliente que se quiere borrar
  const [isDeleting, setIsDeleting] = useState(false); // Muestra spinner de carga en el botón de borrar del modal

  // === EFECTO DE DESCARGA DE DATOS (READ) ===
  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientService.getClients(); // Llama al servicio asíncrono
      setClients(data); // Actualiza la lista en memoria de React
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Hubo un problema al cargar los clientes.');
      addToast(err.message || 'Error al obtener la lista de clientes.', 'error');
    } finally {
      setIsLoading(false); // Apaga la carga
    }
  };

  // Realiza la carga inicial de los clientes
  useEffect(() => {
    fetchClients();
  }, []); 

  // === RENDIMIENTO: FILTRADO REACTIVO EN MEMORIA (useMemo) ===
  /**
   * useMemo memoriza/esconde el resultado del filtrado.
   * Evita volver a filtrar de forma costosa la lista de clientes si el usuario hace clic en otras cosas de la app.
   * Solo vuelve a calcular el array cuando cambia la lista `clients`, el `searchTerm` o el `statusFilter`.
   */
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // Comprueba si el nombre, email o empresa contiene la palabra buscada (sin distinguir mayúsculas/minúsculas)
      const matchesSearch =
        client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.empresa && client.empresa.toLowerCase().includes(searchTerm.toLowerCase()));

      // Comprueba si el estado del cliente coincide con el filtro seleccionado
      const matchesStatus =
        statusFilter === 'todos' || client.estado === statusFilter;

      return matchesSearch && matchesStatus; // Ambos filtros deben cumplirse
    });
  }, [clients, searchTerm, statusFilter]);

  // === FLUJO DE ELIMINACIÓN ===

  /** 1. Abre el modal y recuerda qué ID de cliente queremos borrar */
  const handleDeleteClick = (id: string) => {
    setSelectedClientId(id);
    setDeleteModalOpen(true);
  };

  /** 2. Se ejecuta al hacer clic en "Eliminar permanentemente" dentro del Modal */
  const handleConfirmDelete = async () => {
    if (!selectedClientId) return;
    setIsDeleting(true); // Enciende la rueda de carga del botón del modal
    try {
      await clientService.deleteClient(selectedClientId); // Petición HTTP DELETE asíncrona
      addToast('Cliente eliminado correctamente.', 'success');
      
      // Actualización reactiva instantánea: Filtra y remueve al cliente del estado local
      setClients((prev) => prev.filter((c) => c.id !== selectedClientId));
    } catch (err: any) {
      addToast(err.message || 'No se pudo eliminar el cliente.', 'error');
    } finally {
      setIsDeleting(false); // Apaga la carga
      setDeleteModalOpen(false); // Cierra la ventana modal
      setSelectedClientId(null); // Resetea el ID guardado
    }
  };

  /** Resetea los inputs de filtro a su estado inicial */
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
  };

  return (
    <div className="animate-fade-in">
      
      {/* Encabezado Principal y Botón de Creación */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-header-title">
            Panel de Clientes
          </h1>
          <p className="dashboard-header-desc">
            Consulta, filtra y gestiona los clientes de tu cartera corporativa.
          </p>
        </div>

        <Link
          to="/clientes/nuevo"
          className="btn btn-primary dashboard-header-btn"
        >
          <Plus size={18} />
          Nuevo Cliente
        </Link>
      </div>

      {/* Tarjetas de Estadísticas Analíticas */}
      {!isLoading && !error && <ClientStats clientes={clients} />}

      {/* Barra de Búsqueda y Filtros de Estado */}
      <div className="glass-card dashboard-filters">
        {/* Buscador de texto en tiempo real */}
        <div className="dashboard-search-wrapper">
          <Search size={18} className="dashboard-search-icon" />
          <input
            type="text"
            className="form-input dashboard-search-input"
            placeholder="Buscar por nombre, correo, empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Desplegable de selección de estado */}
        <div className="dashboard-filter-wrapper">
          <Filter size={16} className="dashboard-filter-icon" />
          <select
            className="form-select dashboard-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </div>

      {/* === CONTROL DE ESTADOS VISUALES DEL PANEL === */}

      {/* Estado 1: Cargando */}
      {isLoading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p className="dashboard-loading-text">
            Cargando cartera de clientes...
          </p>
        </div>
      ) : error ? (
        /* Estado 2: Error de Conexión (ej. Servidor apagado) */
        <div className="glass-card dashboard-error-card">
          <AlertCircle size={48} color="var(--color-danger)" />
          <h3 className="dashboard-error-title">Error de Conexión</h3>
          <p className="dashboard-error-desc">
            {error}
          </p>
          <div className="dashboard-error-tip">
             Consejo: Asegúrate de haber encendido el backend ejecutando <code>npm run server</code> en tu terminal de comandos.
          </div>
          <button className="btn btn-primary btn-sm" onClick={fetchClients}>
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      ) : filteredClients.length === 0 ? (
        /* Estado 3: Lista Vacía o sin Coincidencias de Búsqueda */
        <div className="glass-card dashboard-empty-card">
          <FolderOpen size={48} style={{ color: 'var(--text-muted)' }} />
          <h3 className="dashboard-empty-title">No se encontraron clientes</h3>
          <p className="dashboard-empty-desc">
            {clients.length === 0
              ? 'No hay clientes registrados en el sistema. ¡Comienza añadiendo tu primer cliente!'
              : 'Ningún cliente coincide con los criterios de búsqueda o filtros seleccionados.'}
          </p>
          
          {clients.length === 0 ? (
            <Link to="/clientes/nuevo" className="btn btn-primary btn-sm mt-4">
              <Plus size={14} />
              Añadir Cliente
            </Link>
          ) : (
            <button className="btn btn-secondary btn-sm mt-4" onClick={handleResetFilters}>
              Restablecer Filtros
            </button>
          )}
        </div>
      ) : (
        /* Estado 4: Renderizado de la Rejilla de Clientes */
        <div className="client-grid">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              cliente={client}
              onDeleteClick={handleDeleteClick} // Envía callback para abrir modal al presionar eliminar
            />
          ))}
        </div>
      )}

      {/* Modal de confirmación flotante para eliminación */}
      <Modal
        isOpen={deleteModalOpen}
        title="¿Eliminar cliente?"
        message="Esta acción no se puede deshacer. Se borrarán permanentemente todos los datos de contacto y facturación del cliente seleccionado de la base de datos."
        confirmText={isDeleting ? 'Eliminando...' : 'Eliminar permanentemente'}
        cancelText="Cancelar"
        isDanger={true}
        onConfirm={handleConfirmDelete} // Al confirmar, borra de la base de datos
        onCancel={() => {
          // Bloquea el cierre manual si se está ejecutando el borrado asíncrono
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setSelectedClientId(null);
          }
        }}
      />
    </div>
  );
};

