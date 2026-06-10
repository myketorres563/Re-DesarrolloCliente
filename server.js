/**
 * @file server.js
 * @description Servidor API REST Backend simulado creado con Node.js y Express.
 * 
 * ¿PARA QUÉ SIRVE ESTE ARCHIVO?
 * Es el motor del backend. Proporciona una interfaz de programación de aplicaciones (API REST) real que:
 * 1. Escucha peticiones HTTP en el puerto 5000 (o el que se le asigne).
 * 2. Maneja una base de datos temporal en memoria (`let clientes = [...]`). Si el servidor se apaga, los datos vuelven a su estado inicial.
 * 3. Protege los accesos mediante un Middleware de seguridad JWT (`verifyToken`).
 * 4. Resuelve el problema del CORS (Cross-Origin Resource Sharing) para permitir que el frontend de React (puerto 5173 o similar) acceda a los recursos del backend sin que el navegador web bloquee la llamada por seguridad.
 * 
 * ¿DESDE DÓNDE SE LLAMA / CÓMO SE ENCIENDE?
 * - Se ejecuta en una terminal independiente de Node.js mediante el comando `npm run server` o `node server.js`.
 * 
 * ¿DÓNDE SE PUEDE MODIFICAR?
 * - Si deseas añadir nuevos campos a las respuestas JSON de clientes.
 * - Si quieres cambiar la contraseña del administrador para el login real (línea 91).
 * - Si deseas cambiar el puerto en el que escucha la API.
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000; // Define el puerto (usa la variable de entorno o el puerto 5000)

// === MIDDLEWARES CONFIGURADOS ===

// CORS: Permite recibir peticiones HTTP de otros puertos/dominios diferentes (como la app de React en localhost:5173)
app.use(cors());

// express.json(): Middleware que analiza de forma automática los cuerpos de las peticiones que vienen en formato JSON
app.use(express.json());

// Base de datos de prueba cargada inicialmente en la memoria del servidor
let clientes = [
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

/**
 * Middleware personalizado para simular el retardo de red aleatorio de internet.
 * Añade un retraso de entre 100 y 500 milisegundos a todas las peticiones para que la app se sienta más real.
 */
const networkDelay = (req, res, next) => {
  const delay = Math.floor(Math.random() * 400) + 100;
  setTimeout(next, delay);
};

app.use(networkDelay);

/**
 * MIDDLEWARE DE SEGURIDAD: Verifica la validez del Token JWT enviado por el frontend.
 * 
 * ¿Cómo funciona?
 * 1. Busca la cabecera HTTP llamada "Authorization".
 * 2. Comprueba que empiece con la palabra "Bearer ".
 * 3. Valida que el token coincida con nuestra firma secreta ('mock-jwt-token-for-admin').
 * 4. Si es correcto, inyecta la información del usuario logueado en la petición (`req.user`) y llama a `next()` para seguir al endpoint.
 * 5. Si no es válido o falta, devuelve un estado HTTP 401 (Acceso denegado/No autorizado) e impide el paso.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1]; // Extrae el token recortando la palabra "Bearer"
  
  if (token === 'mock-jwt-token-for-admin') {
    req.user = {
      id: '1',
      nombre: 'Administrador',
      email: 'admin@example.com',
      role: 'admin'
    };
    next(); // Da paso al endpoint correspondiente
  } else {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

// --- ENDPOINTS HTTP DE LA API REST ---

/**
 * 1. POST /api/login - Inicio de sesión
 * Comprueba las credenciales enviadas y devuelve un token firmado si son válidas.
 */
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El correo electrónico es obligatorio.' });
  }

  if (!password) {
    return res.status(400).json({ error: 'La contraseña es obligatoria.' });
  }

  // Comprobación de credenciales fijas
  if (email === 'admin@example.com' && password === 'admin') {
    return res.json({
      token: 'mock-jwt-token-for-admin', // Retorna el token que el frontend guardará
      user: {
        id: '1',
        nombre: 'Administrador',
        email: 'admin@example.com',
        role: 'admin'
      }
    });
  }

  return res.status(401).json({ error: 'Credenciales incorrectas. Intente con admin@example.com / admin' });
});

/**
 * 2. GET /api/clientes - Listado completo de clientes
 * Endpoint PROTEGIDO por verifyToken. Retorna la lista en memoria de todos los clientes.
 */
app.get('/api/clientes', verifyToken, (req, res) => {
  res.json(clientes);
});

/**
 * 3. GET /api/clientes/:id - Obtener detalle de un único cliente por su ID
 * Endpoint PROTEGIDO. Busca el cliente específico y lo devuelve. Si no existe, lanza un 404.
 */
app.get('/api/clientes/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const cliente = clientes.find(c => c.id === id);

  if (!cliente) {
    return res.status(404).json({ error: 'Cliente no encontrado.' });
  }

  res.json(cliente);
});

/**
 * 4. POST /api/clientes - Dar de alta un nuevo cliente
 * Endpoint PROTEGIDO. Valida datos mínimos, evita emails duplicados, genera un ID y lo inserta en memoria.
 */
app.post('/api/clientes', verifyToken, (req, res) => {
  const { nombre, email, estado, telefono, empresa } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !email || !estado) {
    return res.status(400).json({ error: 'El nombre, email y estado son campos obligatorios.' });
  }

  // Validación de correos electrónicos únicos
  const emailExists = clientes.some(c => c.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    return res.status(400).json({ error: 'Ya existe un cliente registrado con ese correo electrónico.' });
  }

  const nuevoCliente = {
    id: Date.now().toString(), // Genera un ID basado en el timestamp de milisegundos actual
    nombre,
    email,
    estado,
    telefono: telefono || '',
    empresa: empresa || '',
    createdAt: new Date().toISOString() // Graba la fecha y hora exacta en formato internacional
  };

  clientes.push(nuevoCliente); // Guarda en el array de memoria
  res.status(201).json(nuevoCliente); // Retorna estado 210 (Creado con éxito)
});

/**
 * 5. PUT /api/clientes/:id - Edición completa de un cliente existente
 * Endpoint PROTEGIDO. Busca al cliente por su ID, valida duplicados de correo y sobrescribe sus campos.
 */
app.put('/api/clientes/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { nombre, email, estado, telefono, empresa } = req.body;

  const index = clientes.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Cliente no encontrado.' });
  }

  if (!nombre || !email || !estado) {
    return res.status(400).json({ error: 'El nombre, email y estado son campos obligatorios.' });
  }

  // Validar si el email ya existe registrado en otro cliente diferente al que estamos editando
  const emailExists = clientes.some(c => c.email.toLowerCase() === email.toLowerCase() && c.id !== id);
  if (emailExists) {
    return res.status(400).json({ error: 'Ya existe otro cliente registrado con ese correo electrónico.' });
  }

  clientes[index] = {
    ...clientes[index], // Mantiene la fecha de creación e id original del cliente
    nombre,
    email,
    estado,
    telefono: telefono || '',
    empresa: empresa || '',
  };

  res.json(clientes[index]); // Retorna los datos actualizados
});

/**
 * 6. DELETE /api/clientes/:id - Eliminación física de un cliente de la lista
 * Endpoint PROTEGIDO. Busca el cliente por su ID y lo remueve del array usando splice.
 */
app.delete('/api/clientes/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const index = clientes.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Cliente no encontrado.' });
  }

  clientes.splice(index, 1); // Remueve un elemento a partir de la posición 'index'
  res.json({ message: 'Cliente eliminado correctamente.', id });
});

// === INICIO DEL ESCUCHADOR DEL SERVIDOR ===
app.listen(PORT, () => {
  console.log(`Backend mock en ejecución en http://localhost:${PORT}`);
  console.log(`Endpoints disponibles:`);
  console.log(`  POST   http://localhost:${PORT}/api/login`);
  console.log(`  GET    http://localhost:${PORT}/api/clientes`);
  console.log(`  GET    http://localhost:${PORT}/api/clientes/:id`);
  console.log(`  POST   http://localhost:${PORT}/api/clientes`);
  console.log(`  PUT    http://localhost:${PORT}/api/clientes/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/clientes/:id`);
});

