/**
 * @file clientService.ts
 * @description Capa de Servicios de Datos (Data Service Layer) para la entidad Cliente.
 * 
 * ¿PARA QUÉ SIRVE ESTE ARCHIVO?
 * Centraliza todo el acceso a los datos de los clientes (CRUD: Create, Read, Update, Delete).
 * Evita repetir código HTTP fetch en las vistas (Dashboard, ClientCreate, etc.).
 * Realiza llamadas HTTP asíncronas reales (`fetch`) a la API de Node/Express.
 * Adiciona automáticamente la cabecera `Authorization: Bearer <token>` para pasar los filtros de seguridad del servidor.
 * 
 * ¿DESDE DÓNDE SE LLAMA / CÓMO SE CONECTA?
 * - Es importado por las páginas del panel de administración (`Dashboard`, `ClientCreate`, `ClientEdit`, `ClientDetail`) para realizar las acciones sobre la base de datos de forma inmediata.
 */

import type { Cliente } from '../types';
import { authStorage } from '../auth/authStorage';

/** Obtiene la URL base del backend desde variables de entorno o usa el puerto 5000 por defecto */
const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

/**
 * Helper para construir las cabeceras HTTP necesarias al consumir la API real.
 * Si el administrador está logueado, inyecta su Token JWT en formato "Bearer <token>".
 */
const getAuthHeaders = () => {
  const token = authStorage.getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// === OBJETO EXPORTADO CON LAS PETICIONES CRUD ===
export const clientService = {
  
  // ==========================================
  // 1. GET - Obtener todos los clientes (READ)
  // ==========================================
  async getClients(): Promise<Cliente[]> {
    // Envía petición GET real al endpoint /clientes
    const response = await fetch(`${getApiUrl()}/clientes`, {
      headers: getAuthHeaders(), // Incluye token JWT
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener el listado de clientes.');
    }
    return response.json(); // Retorna el array de clientes devuelto por el servidor
  },

  // ==========================================
  // 2. GET - Obtener un cliente por su ID (READ DETAIL)
  // ==========================================
  async getClientById(id: string): Promise<Cliente> {
    // Envía petición GET al endpoint /clientes/:id
    const response = await fetch(`${getApiUrl()}/clientes/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener la ficha del cliente.');
    }
    return response.json();
  },

  // ==========================================
  // 3. POST - Crear un nuevo cliente (CREATE)
  // ==========================================
  async createClient(clientData: Omit<Cliente, 'id' | 'createdAt'>): Promise<Cliente> {
    // Envía petición POST con el JSON del cliente en el body
    const response = await fetch(`${getApiUrl()}/clientes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(clientData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al dar de alta el cliente.');
    }
    return data;
  },

  // ==========================================
  // 4. PUT - Editar un cliente existente (UPDATE)
  // ==========================================
  async updateClient(id: string, clientData: Omit<Cliente, 'id' | 'createdAt'>): Promise<Cliente> {
    // Envía petición PUT a /clientes/:id para actualizar los datos en el servidor
    const response = await fetch(`${getApiUrl()}/clientes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(clientData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al actualizar los datos del cliente.');
    }
    return data;
  },

  // ==========================================
  // 5. DELETE - Eliminar un cliente (DELETE)
  // ==========================================
  async deleteClient(id: string): Promise<string> {
    // Envía petición DELETE real a /clientes/:id
    const response = await fetch(`${getApiUrl()}/clientes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al eliminar el cliente.');
    }
    return id; // Devuelve el id del cliente eliminado
  }
};
