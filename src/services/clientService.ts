import type { Cliente } from '../types';

// Obtener la URL base desde las variables de entorno
const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

// Obtener el token de autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Determinar si debemos usar el mock en localStorage
const isMockMode = () => {
  const stored = localStorage.getItem('use_mock_backend');
  return stored === 'true' || !stored; // Por defecto es true
};

// Simulación de retraso de red (ms)
const delay = (ms: number = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// Datos iniciales de mock
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

// Obtener la base de datos local
const getMockDatabase = (): Cliente[] => {
  const stored = localStorage.getItem('mock_clients_db');
  if (!stored) {
    localStorage.setItem('mock_clients_db', JSON.stringify(MOCK_INITIAL_CLIENTS));
    return MOCK_INITIAL_CLIENTS;
  }
  return JSON.parse(stored);
};

// Guardar en la base de datos local
const saveMockDatabase = (clients: Cliente[]) => {
  localStorage.setItem('mock_clients_db', JSON.stringify(clients));
};

export const clientService = {
  // 1. GET - Obtener todos los clientes
  async getClients(): Promise<Cliente[]> {
    if (isMockMode()) {
      await delay(600);
      return getMockDatabase();
    } else {
      const response = await fetch(`${getApiUrl()}/clientes`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener el listado de clientes.');
      }
      return response.json();
    }
  },

  // 2. GET - Obtener un cliente por su ID
  async getClientById(id: string): Promise<Cliente> {
    if (isMockMode()) {
      await delay(400);
      const db = getMockDatabase();
      const client = db.find((c) => c.id === id);
      if (!client) {
        throw new Error('Cliente no encontrado en la base de datos.');
      }
      return client;
    } else {
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

  // 3. POST - Crear un nuevo cliente
  async createClient(clientData: Omit<Cliente, 'id' | 'createdAt'>): Promise<Cliente> {
    if (isMockMode()) {
      await delay(800);
      const db = getMockDatabase();

      // Validar si el email ya existe
      const emailExists = db.some((c) => c.email.toLowerCase() === clientData.email.toLowerCase());
      if (emailExists) {
        throw new Error('Ya existe un cliente registrado con ese correo electrónico.');
      }

      const nuevoCliente: Cliente = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      db.push(nuevoCliente);
      saveMockDatabase(db);
      return nuevoCliente;
    } else {
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

  // 4. PUT - Editar un cliente existente
  async updateClient(id: string, clientData: Omit<Cliente, 'id' | 'createdAt'>): Promise<Cliente> {
    if (isMockMode()) {
      await delay(800);
      const db = getMockDatabase();
      const index = db.findIndex((c) => c.id === id);
      
      if (index === -1) {
        throw new Error('Cliente no encontrado.');
      }

      // Validar si el email ya existe en otro cliente
      const emailExists = db.some((c) => c.email.toLowerCase() === clientData.email.toLowerCase() && c.id !== id);
      if (emailExists) {
        throw new Error('Ya existe otro cliente registrado con ese correo electrónico.');
      }

      const clienteActualizado: Cliente = {
        ...db[index],
        ...clientData,
      };

      db[index] = clienteActualizado;
      saveMockDatabase(db);
      return clienteActualizado;
    } else {
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

  // 5. DELETE - Eliminar un cliente
  async deleteClient(id: string): Promise<string> {
    if (isMockMode()) {
      await delay(500);
      const db = getMockDatabase();
      const index = db.findIndex((c) => c.id === id);
      
      if (index === -1) {
        throw new Error('Cliente no encontrado.');
      }

      db.splice(index, 1);
      saveMockDatabase(db);
      return id;
    } else {
      const response = await fetch(`${getApiUrl()}/clientes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar el cliente.');
      }
      return id;
    }
  }
};
