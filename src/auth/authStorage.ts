/**
 * @file authStorage.ts
 * @description Capa de persistencia local (Wrapper de localStorage).
 * 
 * ¿PARA QUÉ SIRVE ESTE ARCHIVO?
 * Es el encargado de guardar, leer o borrar datos directamente en el almacenamiento persistente del navegador (`localStorage`).
 * Gracias a esto:
 * 1. El token JWT y los datos del usuario logueado no se borran al recargar la página (F5) o cerrar el navegador.
 */

import type { User } from '../types';

// Nombres de las variables (Keys) que se grabarán físicamente en el navegador
const TOKEN_KEY = 'auth_token'; // Clave para guardar el token JWT cifrado
const USER_KEY = 'auth_user'; // Clave para guardar los datos JSON del usuario logueado

export const authStorage = {
  // === MÉTODOS DEL TOKEN JWT ===

  /** Obtiene la cadena de texto del token actual (o null si no hay sesión) */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /** Graba el token JWT en el navegador */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /** Borra específicamente el token */
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // === MÉTODOS DEL USUARIO ===

  /** Obtiene los datos del usuario logueado. Como en localStorage todo se guarda como texto, 
   *  utilizamos JSON.parse() para volver a convertirlo en un objeto de TypeScript. */
  getUser(): User | null {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      // Si el texto está corrupto, limpiamos la clave y retornamos null
      this.clearUser();
      return null;
    }
  },

  /** Graba los datos del usuario convirtiendo el objeto de TypeScript a texto legible mediante JSON.stringify() */
  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /** Borra específicamente los datos del usuario */
  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  // === CERRAR SESIÓN TOTAL ===

  /** Limpia todas las credenciales del usuario al cerrar sesión (logout) */
  clearAll(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

