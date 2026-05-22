import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Datos iniciales de clientes en memoria
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

// Helper para simular retardo de red (100ms - 500ms)
const networkDelay = (req, res, next) => {
  const delay = Math.floor(Math.random() * 400) + 100;
  setTimeout(next, delay);
};

app.use(networkDelay);

// Middleware para verificar la cabecera de Autorización JWT (simulada)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1];
  // Validamos si es nuestro token esperado
  if (token === 'mock-jwt-token-for-admin') {
    req.user = {
      id: '1',
      nombre: 'Administrador',
      email: 'admin@example.com',
      role: 'admin'
    };
    next();
  } else {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

// --- ENDPOINTS ---

// 1. POST /api/login - Inicio de sesión
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  // Credenciales de prueba: admin@example.com / admin
  if (email === 'admin@example.com' && password === 'admin') {
    return res.json({
      token: 'mock-jwt-token-for-admin',
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

// 2. GET /api/clientes - Listado completo de clientes (Protegido)
app.get('/api/clientes', verifyToken, (req, res) => {
  res.json(clientes);
});

// 3. GET /api/clientes/:id - Obtener detalle de cliente (Protegido)
app.get('/api/clientes/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const cliente = clientes.find(c => c.id === id);

  if (!cliente) {
    return res.status(404).json({ error: 'Cliente no encontrado.' });
  }

  res.json(cliente);
});

// 4. POST /api/clientes - Alta de nuevo cliente (Protegido)
app.post('/api/clientes', verifyToken, (req, res) => {
  const { nombre, email, estado, telefono, empresa } = req.body;

  if (!nombre || !email || !estado) {
    return res.status(400).json({ error: 'El nombre, email y estado son campos obligatorios.' });
  }

  // Validar si el email ya existe
  const emailExists = clientes.some(c => c.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    return res.status(400).json({ error: 'Ya existe un cliente registrado con ese correo electrónico.' });
  }

  const nuevoCliente = {
    id: Date.now().toString(),
    nombre,
    email,
    estado,
    telefono: telefono || '',
    empresa: empresa || '',
    createdAt: new Date().toISOString()
  };

  clientes.push(nuevoCliente);
  res.status(201).json(nuevoCliente);
});

// 5. PUT /api/clientes/:id - Edición de cliente existente (Protegido)
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

  // Validar si el email ya existe en otro cliente diferente
  const emailExists = clientes.some(c => c.email.toLowerCase() === email.toLowerCase() && c.id !== id);
  if (emailExists) {
    return res.status(400).json({ error: 'Ya existe otro cliente registrado con ese correo electrónico.' });
  }

  clientes[index] = {
    ...clientes[index],
    nombre,
    email,
    estado,
    telefono: telefono || '',
    empresa: empresa || '',
  };

  res.json(clientes[index]);
});

// 6. DELETE /api/clientes/:id - Eliminación de cliente (Protegido)
app.delete('/api/clientes/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const index = clientes.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Cliente no encontrado.' });
  }

  clientes.splice(index, 1);
  res.json({ message: 'Cliente eliminado correctamente.', id });
});

// Iniciar servidor
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
