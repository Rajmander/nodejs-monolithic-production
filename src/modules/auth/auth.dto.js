/**
 * @file auth.dto.js
 * @description Zod validation schemas for Authentication requests (registration, login, refresh).
 */

import { z } from 'zod';

import { ALL_ROLES, UserRole } from '../../constants/roles.constant.js';

/**
 * Registration request body validation schema.
 * Enforces strong password complexity (min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char).
 */
export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one numerical digit')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special symbol'),
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  role: z
    .enum(/** @type {[string, ...string[]]} */ (ALL_ROLES))
    .optional()
    .default(UserRole.USER),
});

/**
 * Login request body validation schema.
 */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Refresh token request body validation schema.
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
