/**
 * @file Cliente.ts
 * @description Define la estructura estricta de datos (Interface) para un Cliente en TypeScript.
 * 
 * ¿PARA QUÉ SIRVE ESTE ARCHIVO?
 * Define qué propiedades o campos obligatorios y opcionales tiene un Cliente.
 * Ayuda a que TypeScript nos avise si intentamos acceder a un campo inexistente o si olvidamos enviar un campo obligatorio al guardar.
 * 
 * ¿DÓNDE SE PUEDE MODIFICAR?
 * - Si decides añadir un nuevo campo a tus clientes (ej. "direccion", "rfc", "ciudad"), debes agregarlo aquí.
 *   Ejemplo: `direccion?: string;` (El signo `?` significa que el campo es opcional).
 */

export interface Cliente {
  id: string; // Identificador único del cliente (obligatorio)
  nombre: string; // Nombre completo o razón social (obligatorio)
  email: string; // Correo electrónico de contacto (obligatorio, debe ser único)
  estado: 'activo' | 'inactivo'; // Estado de la cuenta (solo puede ser uno de estos dos valores literales)
  telefono?: string; // Número de teléfono (opcional)
  empresa?: string; // Nombre de la empresa a la que pertenece (opcional)
  createdAt?: string; // Fecha en que se dio de alta en formato ISO string (opcional)
}

