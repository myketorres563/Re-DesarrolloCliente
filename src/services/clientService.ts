/**
 * @file clientService.ts
 * @description Capa de Servicios de Datos (Data Service Layer) para la entidad Cliente.
 * 
 * ¿PARA QUÉ SIRVE ESTE ARCHIVO?
 * Centraliza todo el acceso a los datos de los clientes (CRUD: Create, Read, Update, Delete).
 * Evita repetir código HTTP fetch en las vistas (Dashboard, ClientCreate, etc.).
 * Al igual que la autenticación, posee un soporte DUAL inteligente controlado por `useMockBackend`:
 * 1. MODO SIMULADO (LOCAL):
 *    - Guarda la lista de clientes en la clave `mock_clients_db` de `localStorage` en formato JSON legible.
 *    - Si la clave no existe, la inicializa con 4 clientes de prueba predefinidos (`MOCK_INITIAL_CLIENTS`).
 *    - Añade una latencia voluntaria (`delay`) usando Promesas para simular la lentitud real del internet y poder ver los spinners de carga.
 * 2. MODO API REST REAL:
 *    - Realiza llamadas HTTP asíncronas reales (`fetch`) a la API de Node/Express en localhost:5000.
 *    - Adiciona automáticamente la cabecera `Authorization: Bearer <token>` para pasar los filtros de seguridad del servidor.
 * 
 * ¿DESDE DÓNDE SE LLAMA / CÓMO SE CONECTA?
 * - Es importado por las páginas del panel de administración (`Dashboard`, `ClientCreate`, `ClientEdit`, `ClientDetail`) para realizar las acciones sobre la base de datos de forma inmediata.
 * 
 * ¿DÓNDE SE PUEDE MODIFICAR?
 * - Si quieres cambiar los datos iniciales de los clientes simulados (agregar más nombres o empresas por defecto en `MOCK_INITIAL_CLIENTS`).
 * - Si deseas cambiar los tiempos de retraso artificial (`delay(ms)`).
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

/** Comprueba si el interruptor del backend simulado está activo en las opciones */
const isMockMode = () => {
  return authStorage.getUseMockBackend();
};

/**
 * Función utilitaria para simular esperas de red asíncronas mediante Promesas.
 * Detiene la ejecución la cantidad de milisegundos indicada.
 */
const delay = (ms: number = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// === DATOS SEMILLA DE PRUEBA (MOCK SEED) ===
const MOCK_INITIAL_CLIENTS: Cliente[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    estado: 'activo',
    telefono: '+34 600 112 233',
    empresa: 'Tecnologías del Sur S.L.',
    createdAt: new Date('2026-01-15').toISOString(),
  },
  {
    id: '2',
    nombre: 'María Gómez',
    email: 'maria.gomez@corporacion.es',
    estado: 'inactivo',
    telefono: '+34 655 443 322',
    empresa: 'Gómez Consultores',
    createdAt: new Date('2026-02-20').toISOString(),
  },
  {
    id: '3',
    nombre: 'Carlos Rodríguez',
    email: 'carlos.rod@webdev.com',
    estado: 'activo',
    telefono: '+34 622 998 877',
    empresa: 'WebDev Studio',
    createdAt: new Date('2026-03-05').toISOString(),
  },
  {
    id: '4',
    nombre: 'Ana Belén Martínez',
    email: 'ana.martinez@logistica.com',
    estado: 'activo',
    telefono: '+34 677 334 455',
    empresa: 'Logística Express',
    createdAt: new Date('2026-04-12').toISOString(),
  }
];

// === HELPERS DE BASE DE DATOS LOCAL EN EL NAVEGADOR ===

/** Obtiene la lista actual de clientes de localStorage (o la crea si es la primera vez) */
const getMockDatabase = (): Cliente[] => {
  const stored = localStorage.getItem('mock_clients_db');
  if (!stored) {
    localStorage.setItem('mock_clients_db', JSON.stringify(MOCK_INITIAL_CLIENTS));
    return MOCK_INITIAL_CLIENTS;
  }
  return JSON.parse(stored);
};

/** Graba una lista de clientes convirtiéndola en texto dentro de localStorage */
const saveMockDatabase = (clients: Cliente[]) => {
  localStorage.setItem('mock_clients_db', JSON.stringify(clients));
};

// === OBJETO EXPORTADO CON LAS PETICIONES CRUD ===
export const clientService = {
  
  // ==========================================
  // 1. GET - Obtener todos los clientes (READ)
  // ==========================================
  async getClients(): Promise<Cliente[]> {
    if (isMockMode()) {
      await delay(600); // Retraso para ver el spinner
      return getMockDatabase(); // Retorna los datos locales
    } else {
      // Envía petición GET real al endpoint /clientes
      const response = await fetch(`${getApiUrl()}/clientes`, {
        headers: getAuthHeaders(), // Incluye token JWT
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener el listado de clientes.');
      }
      return response.json(); // Retorna el array de clientes devuelto por el servidor
    }
  },

  // ==========================================
  // 2. GET - Obtener un cliente por su ID (READ DETAIL)
  // ==========================================
  async getClientById(id: string): Promise<Cliente> {
    if (isMockMode()) {
      await delay(400);
      const db = getMockDatabase();
      const client = db.find((c) => c.id === id); // Busca por id en el array local
      if (!client) {
        throw new Error('Cliente no encontrado en la base de datos.');
      }
      return client;
    } else {
      // Envía petición GET al endpoint /clientes/:id
      const response = await fetch(`${getApiUrl()}/clientes/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener la ficha del cliente.');
      }
      return response.json();
    }
  },

  // ==========================================
  // 3. POST - Crear un nuevo cliente (CREATE)
  // ==========================================
  async createClient(clientData: Omit<Cliente, 'id' | 'createdAt'>): Promise<Cliente> {
    if (isMockMode()) {
      await delay(800);
      const db = getMockDatabase();

      // Validar si el email ya existe para evitar duplicados en local
      const emailExists = db.some((c) => c.email.toLowerCase() === clientData.email.toLowerCase());
      if (emailExists) {
        throw new Error('Ya existe un cliente registrado con ese correo electrónico.');
      }

      // Crea el objeto agregándole un ID numérico aleatorio y la fecha de hoy
      const nuevoCliente: Cliente = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      db.push(nuevoCliente); // Lo agregamos al array
      saveMockDatabase(db); // Lo guardamos en localStorage
      return nuevoCliente;
    } else {
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
    }
  },

  // ==========================================
  // 4. PUT - Editar un cliente existente (UPDATE)
  // ==========================================
  async updateClient(id: string, clientData: Omit<Cliente, 'id' | 'createdAt'>): Promise<Cliente> {
    if (isMockMode()) {
      await delay(800);
      const db = getMockDatabase();
      const index = db.findIndex((c) => c.id === id); // Busca el índice de la posición en el array
      
      if (index === -1) {
        throw new Error('Cliente no encontrado.');
      }

      // Validar si el email ya existe en otro cliente diferente
      const emailExists = db.some((c) => c.email.toLowerCase() === clientData.email.toLowerCase() && c.id !== id);
      if (emailExists) {
        throw new Error('Ya existe otro cliente registrado con ese correo electrónico.');
      }

      // Combina las propiedades antiguas del cliente con los nuevos datos enviados del formulario
      const clienteActualizado: Cliente = {
        ...db[index],
        ...clientData,
      };

      db[index] = clienteActualizado; // Sobrescribe la posición
      saveMockDatabase(db); // Guarda
      return clienteActualizado;
    } else {
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
    }
  },

  // ==========================================
  // 5. DELETE - Eliminar un cliente (DELETE)
  // ==========================================
  async deleteClient(id: string): Promise<string> {
    if (isMockMode()) {
      await delay(500);
      const db = getMockDatabase();
      const index = db.findIndex((c) => c.id === id);
      
      if (index === -1) {
        throw new Error('Cliente no encontrado.');
      }

      db.splice(index, 1); // Elimina el elemento en esa posición del array
      saveMockDatabase(db); // Guarda
      return id;
    } else {
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
  }
};

