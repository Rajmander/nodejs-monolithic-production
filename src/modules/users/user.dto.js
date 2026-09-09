/**
 * @file user.dto.js
 * @description Zod validation schemas for User endpoints.
 */

import { z } from 'zod';

import { ALL_ROLES } from '../../constants/roles.constant.js';

/**
 * Validation schema for updating user profile.
 */
export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name cannot be empty').max(50).optional(),
  lastName: z.string().min(1, 'Last name cannot be empty').max(50).optional(),
});

/**
 * Validation schema for querying/listing users with pagination and filtering.
 */
export const queryUserSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  role: z.enum(/** @type {[string, ...string[]]} */ (ALL_ROLES)).optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(['createdAt', 'email', 'firstName', 'lastName']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Helper to sanitize user object by removing sensitive credentials.
 * @param {Object} user Full user entity
 * @returns {Object} Public user object without passwordHash
 */
export function sanitizeUser(user) {
  if (!user) return null;
  if (typeof user.toPublicJSON === 'function') {
    return user.toPublicJSON();
  }
  const { passwordHash: _, ...publicFields } = user;
  return publicFields;
}
