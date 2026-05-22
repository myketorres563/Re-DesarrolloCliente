#  ClientFlow - Gestor de Clientes (CRUD & JWT)

**ClientFlow** es una aplicación web frontend premium para la gestión y administración de carteras de clientes empresariales. Ha sido desarrollada utilizando **React, TypeScript y Vite**, implementando un diseño de vanguardia con estética *dark mode* y componentes *glassmorphism* (efecto cristal translúcido), logrando una experiencia de usuario sumamente interactiva y libre de dependencias pesadas como TailwindCSS.

La plataforma se conecta de manera asíncrona mediante peticiones seguras con tokens de sesión **JWT** (JSON Web Token) a una API REST y cuenta con un sistema de **Soporte Dual** que permite simular peticiones con latencia directamente en el navegador si no hay un servidor encendido.

---

##  Detalles del Autor y Proyecto
- **Proyecto:** Práctica Final – Desarrollo de una aplicación frontend con React.
- **Entidad de Gestión:** `Cliente` (Nombre, Email, Estado [Activo/Inactivo], Teléfono, Empresa y Fecha de Registro).
- **Autor:** Miguel Ángel.
- **Entorno de Ejecución:** Windows + Node.js (Vite Dev Server).

---

##  Tecnologías Utilizadas

- **Core:** React 19 + TypeScript + Vite.
- **Enrutamiento:** React Router Dom v7 (Control de rutas públicas, privadas y 404).
- **Estilos:** CSS Vanilla (Sistema de diseño basado en variables HSL/Hex customizables, Blur de fondo y micro-animaciones en botones/inputs/tarjetas).
- **Iconografía:** Lucide React (Vectores nítidos y elegantes).
- **Backend Mock:** Express (Node.js) con soporte CORS para simular el servidor real.

---

##  Arquitectura de Soporte Dual (API Real vs. Mock)

Una de las características más avanzadas del proyecto es su selector de backend en tiempo real, visible en la cabecera:
1. **Modo Local Simulado (Por Defecto):** La aplicación funciona al 100% de manera autónoma de inmediato usando `localStorage` para persistir los clientes creados, modificados o eliminados. Simula latencia de red y validaciones de correos repetidos automáticamente. **¡Ideal para correcciones rápidas sin tocar la terminal!**
2. **Modo API Real:** La aplicación realiza peticiones asíncronas de red mediante `fetch` al servidor REST local configurado en el archivo `.env`. Adjunta de manera segura el JWT en la cabecera `Authorization: Bearer <token>` para todas las peticiones privadas.

---

##  Credenciales de Acceso (Usuario de Prueba)
Para iniciar sesión en el panel y ver las rutas privadas, utiliza las siguientes credenciales (compatibles tanto en modo Local como en el Servidor Real):

- **Correo Electrónico:** `admin@example.com`
- **Contraseña:** `admin`

*(Nota: En la interfaz de inicio de sesión cuentas con un botón de **"Rellenar automáticamente"** para agilizar las pruebas).*

---

##  Pasos de Instalación y Arranque

###  Requisitos Previos
Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).

### 1️ Clonar o Descargar el Proyecto
Descomprime el archivo o sitúate en el directorio de trabajo:
```bash
cd Re-DesarrolloCliente
```

### 2️ Instalar Dependencias del Proyecto
Instala todos los paquetes necesarios del frontend y el servidor de pruebas en un solo comando:
```bash
npm install
```

### 3️ Configuración del Entorno (`.env`)
En la raíz del proyecto se incluye el archivo `.env` configurado por defecto:
```env
VITE_API_URL=http://localhost:5000/api
```

---

##  Instrucciones de Ejecución

Tienes dos formas de ejecutar e interactuar con la aplicación:

### Opción A: Ejecutar SOLO el Frontend (Modo Local con Mock) - *Recomendado para pruebas inmediatas*
Esta opción **no requiere** iniciar ningún servidor de base de datos o backend en otra terminal.
```bash
# Iniciar el servidor de desarrollo de Vite
npm run dev
```
Abre en tu navegador [http://localhost:5173](http://localhost:5173). Asegúrate de que el selector de la esquina superior derecha de la cabecera marque **"Local"** (se activa automáticamente). ¡Prueba a crear, editar, filtrar y eliminar clientes!

### Opción B: Ejecutar Frontend + Backend REST Real
Si deseas evaluar la comunicación asíncrona real a través del protocolo HTTP, abre dos terminales:

**Terminal 1 (Backend Express REST):**
```bash
npm run server
```
*Esto iniciará la API REST real en `http://localhost:5000/api` con logs de peticiones y persistencia en memoria.*

**Terminal 2 (Frontend React):**
```bash
npm run dev
```
Abre en tu navegador [http://localhost:5173](http://localhost:5173). Cambia el selector en la esquina superior derecha a **"API Real"**. Verás cómo la aplicación se comunica de forma asíncrona y fluida con el servidor de Node, protegiendo las peticiones con JWT.

---

##  Checklist de Requisitos Mínimos Cumplidos

A continuación se detalla la lista de verificación que demuestra la cobertura completa de las directivas de la rúbrica:

###  Rutas y Autenticación JWT
- [x] **Página Pública de Inicio:** Presentación elegante con explicaciones de valor y enlaces dinámicos (`/`).
- [x] **Página Pública de Login:** Formulario estilizado con control de estados de envío y validaciones en tiempo real (`/login`).
- [x] **Almacenamiento del JWT:** Persistencia segura del token y datos del perfil en `localStorage`.
- [x] **Rutas Protegidas:** Componente `ProtectedRoute` que impide la visualización del dashboard sin sesión activa y redirige al login.
- [x] **Cierre de sesión (Logout):** Limpieza completa del token e información de usuario, mostrando una alerta visual.
- [x] **Página 404:** Interfaz divertida y moderna ante rutas inexistentes con botón de rescate (`*`).

###  Operaciones CRUD (Entidad: Cliente)
- [x] **Listado de Elementos (GET):** Vista en panel de control estructurada en rejilla con filtros interactivos (`/dashboard`).
- [x] **Detalle del Elemento (GET):** Ficha detallada del cliente con datos de contacto, organización y fecha de registro (`/clientes/:id`).
- [x] **Alta de Elemento (POST):** Formulario interactivo con validación de campos obligatorios e email único (`/clientes/nuevo`).
- [x] **Edición de Elemento (PUT/PATCH):** Formulario pre-cargado que actualiza de manera segura el perfil del cliente (`/clientes/editar/:id`).
- [x] **Eliminación de Elemento (DELETE):** Acción protegida por un **Modal interactivo** de confirmación de borrado definitivo.

###  Requisitos Técnicos de React
- [x] **React + TypeScript:** Estructura type-safe libre de errores de compilación (`npm run build` verificado con éxito).
- [x] **React Router v7:** Gestión robusta de rutas públicas, privadas y comodín.
- [x] **Uso de Hooks:** `useState`, `useEffect`, `useContext`, `useCallback`, `useMemo` y `useParams`.
- [x] **Manejo de Eventos:** `onSubmit`, `onChange`, `onClick` integrados con validaciones y preventivas de red.
- [x] **Feedback visual al usuario:** Componentes efímeros `Toast` dinámicos (notificaciones de éxito, error y advertencias) integrados de forma no intrusiva.
- [x] **Estados de Carga y Vacíos:** Spinners orbitales animados para cargas asíncronas y vistas ilustradas cuando no hay resultados o la API está desconectada.
