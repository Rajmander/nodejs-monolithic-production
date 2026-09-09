/**
 * @file roles.constant.js
 * @description User roles definition for Role-Based Access Control (RBAC).
 */

/**
 * Standard User Roles.
 * @readonly
 * @enum {string}
 */
export const UserRole = Object.freeze({
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
});

/**
 * Array of all supported roles for schema validation.
 * @type {string[]}
 */
export const ALL_ROLES = Object.values(UserRole);
