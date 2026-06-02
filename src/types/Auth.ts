/**
 * @file Auth.ts
 * @description Define las interfaces de datos para los usuarios y el estado del sistema de sesión.
 * 
 * ¿PARA QUÉ SIRVE ESTE ARCHIVO?
 * 1. `User`: Define qué datos sabemos sobre el administrador o usuario que inicia sesión (su id, email, nombre y rol).
 * 2. `AuthState`: Modela la memoria de sesión del navegador. Nos dice quién está conectado (`user`), su token de acceso JWT (`token`), si está validado (`isAuthenticated`) y si la aplicación está procesando o cargando sus datos (`loading`).
 * 
 * ¿DÓNDE SE PUEDE MODIFICAR?
 * - Si deseas añadir nuevos datos al usuario (como una foto de perfil, un departamento, etc.), debes agregarlos a `User`.
 */

export interface User {
  id: string; // Identificador único de usuario (ej. "1" para el admin)
  email: string; // Correo con el que accede (ej. admin@example.com)
  nombre: string; // Nombre visible en la barra superior (ej. "Administrador")
  role?: string; // Nivel de acceso opcional (ej. "admin")
}

export interface AuthState {
  user: User | null; // Datos del usuario activo (null si no ha iniciado sesión)
  token: string | null; // Cadena JWT firmada que viaja al backend en cada petición (null si no hay sesión)
  isAuthenticated: boolean; // Flag rápido para saber si tiene acceso permitido (true/false)
  loading: boolean; // Flag de carga para esperar a que localStorage se lea al iniciar la página
}

