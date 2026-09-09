/**
 * @file product.dto.js
 * @description Zod validation schemas for Product catalog domain.
 */

import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().trim().min(5, 'Description must be at least 5 characters').max(1000),
  price: z.coerce.number().positive('Price must be a positive number'),
  sku: z
    .string()
    .trim()
    .toUpperCase()
    .min(3, 'SKU must be at least 3 characters')
    .max(30)
    .regex(
      /^[A-Z0-9_-]+$/,
      'SKU may only contain alphanumeric characters, dashes, and underscores',
    ),
  category: z.string().trim().min(2, 'Category must be specified').max(50),
  stockQuantity: z.coerce.number().int().min(0, 'Stock quantity cannot be negative'),
});

export const updateProductSchema = createProductSchema.partial();

export const queryProductSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  sortBy: z.enum(['createdAt', 'price', 'name', 'stockQuantity']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
