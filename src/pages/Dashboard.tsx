import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Cliente } from '../types';
import { clientService } from '../services/clientService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ClientCard } from '../components/clients/ClientCard';
import { ClientStats } from '../components/clients/ClientStats';
import { Modal } from '../components/ui/Modal';
import { Plus, Search, Filter, AlertCircle, RefreshCw, FolderOpen } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { addToast } = useToast();
  const { useMockBackend } = useAuth();
  
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'activo' | 'inactivo'>('todos');

  // Estado del Modal de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar clientes
  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await clientService.getClients();
      setClients(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Hubo un problema al cargar los clientes.');
      addToast(err.message || 'Error al obtener la lista de clientes.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [useMockBackend]); // Recargar si cambia el modo de backend

  // Filtrar clientes en memoria
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.empresa && client.empresa.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'todos' || client.estado === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  // Manejar click en borrar (Abre modal)
  const handleDeleteClick = (id: string) => {
    setSelectedClientId(id);
    setDeleteModalOpen(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!selectedClientId) return;
    setIsDeleting(true);
    try {
      await clientService.deleteClient(selectedClientId);
      addToast('Cliente eliminado correctamente.', 'success');
      // Actualizar listado en memoria
      setClients((prev) => prev.filter((c) => c.id !== selectedClientId));
    } catch (err: any) {
      addToast(err.message || 'No se pudo eliminar el cliente.', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setSelectedClientId(null);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
  };

  return (
    <div className="animate-fade-in">
      
      {/* Encabezado y Botón de Crear */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Panel de Clientes
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Consulta, filtra y gestiona los clientes de tu cartera corporativa.
          </p>
        </div>

        <Link
          to="/clientes/nuevo"
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}
        >
          <Plus size={18} />
          Nuevo Cliente
        </Link>
      </div>

      {/* Indicador del Estado del Backend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          padding: '8px 16px',
          borderRadius: 'var(--border-radius-sm)',
          marginBottom: '24px',
          alignSelf: 'flex-start',
          width: 'fit-content'
        }}
      >
        <div 
          style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: useMockBackend ? 'var(--color-primary)' : 'var(--color-success)',
            boxShadow: useMockBackend ? 'var(--glow-primary)' : '0 0 8px var(--color-success)'
          }}
        ></div>
        <span>Modo de backend activo: <strong>{useMockBackend ? 'Almacenamiento Local Simulado' : 'Servidor Express Real (Puerto 5000)'}</strong></span>
      </div>

      {/* Estadísticas */}
      {!isLoading && !error && <ClientStats clientes={clients} />}

      {/* Barra de Filtros */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginBottom: '32px',
          padding: '16px 20px',
        }}
      >
        {/* Buscador de texto */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '44px' }}
            placeholder="Buscar por nombre, correo, empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtro de estado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
          <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{ padding: '10px 36px 10px 16px' }}
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Estados Visuales de Carga / Error / Lista */}
      {isLoading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            Cargando cartera de clientes...
          </p>
        </div>
      ) : error ? (
        <div
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: '40px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <AlertCircle size={48} color="var(--color-danger)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Error de Conexión</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 8px auto', lineHeight: 1.6 }}>
            {error}
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-warning)', backgroundColor: 'var(--color-warning-bg)', padding: '8px 16px', borderRadius: '4px', maxWidth: '500px', marginBottom: '16px' }}>
            💡 Consejo: Si estás en modo <strong>API Real</strong>, asegúrate de haber encendido el backend ejecutando <code>npm run server</code> en la terminal, o cambia al modo <strong>Local</strong> arriba a la derecha.
          </div>
          <button className="btn btn-primary btn-sm" onClick={fetchClients}>
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      ) : filteredClients.length === 0 ? (
        <div
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <FolderOpen size={48} style={{ color: 'var(--text-muted)' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>No se encontraron clientes</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
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
        /* Rejilla de Clientes */
        <div className="client-grid">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              cliente={client}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      <Modal
        isOpen={deleteModalOpen}
        title="¿Eliminar cliente?"
        message="Esta acción no se puede deshacer. Se borrarán permanentemente todos los datos de contacto y facturación del cliente seleccionado de la base de datos."
        confirmText={isDeleting ? 'Eliminando...' : 'Eliminar permanentemente'}
        cancelText="Cancelar"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setSelectedClientId(null);
          }
        }}
      />
    </div>
  );
};
